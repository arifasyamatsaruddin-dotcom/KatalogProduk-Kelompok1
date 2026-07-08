document.addEventListener('DOMContentLoaded', () => {
  const sectorSelect = document.getElementById('sectorSelect');
  const metricsContainer = document.getElementById('sectorMetricsContainer');

  if (!sectorSelect || !metricsContainer) return;

  // Coordinate mapping for sector cities
  const coordinates = {
    tokyo: { lat: 35.6762, lon: 139.6503, name: 'Tokyo (Sector Alpha)' },
    berlin: { lat: 52.5200, lon: 13.4050, name: 'Berlin (Sector Beta)' },
    newyork: { lat: 40.7128, lon: -74.0060, name: 'New York (Sector Gamma)' }
  };

  // 1. Initialize State using the custom useState hook from helpers.js
  const [getSector, setSector, subscribeSector] = useState(sectorSelect.value || 'tokyo');

  // 2. Event listener to update state when dropdown selection changes
  sectorSelect.addEventListener('change', (e) => {
    setSector(e.target.value);
  });

  const renderLoading = () => {
    metricsContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center p-12 col-span-3 space-y-4">
        <span class="material-symbols-outlined text-[32px] animate-spin text-primary">sync</span>
        <p class="font-display-lg text-[10px] uppercase tracking-widest text-secondary font-bold">Synchronizing Sector Satellite Feed...</p>
      </div>
    `;
  };

  const renderError = (message) => {
    metricsContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center p-12 col-span-3 border border-red-500/20 bg-red-50/50 rounded-xl space-y-2">
        <span class="material-symbols-outlined text-[32px] text-red-500">error</span>
        <p class="font-display-lg text-xs uppercase tracking-widest text-red-600 font-bold">${message}</p>
        <button id="retryBtn" class="bg-primary text-white px-4 py-2 font-display-lg text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-colors font-bold mt-2">Retry Conn</button>
      </div>
    `;
    document.getElementById('retryBtn')?.addEventListener('click', () => {
      // Re-trigger by force updating the sector
      setSector(getSector());
    });
  };

  const renderMetrics = (data, sectorName) => {
    const temp = data.temperature_2m ?? '--';
    const humidity = data.relative_humidity_2m ?? '--';
    const wind = data.wind_speed_10m ?? '--';

    metricsContainer.innerHTML = `
      <!-- Temperature Metric -->
      <div class="p-6 bg-surface-container border border-outline-variant rounded-xl space-y-2 hover:border-primary transition-all duration-300 group">
        <div class="flex justify-between items-center text-secondary group-hover:text-primary transition-colors">
          <span class="font-display-lg text-[10px] uppercase tracking-widest font-bold">Thermal Index</span>
          <span class="material-symbols-outlined text-[18px]">thermostat</span>
        </div>
        <div class="font-display-lg text-3xl font-bold text-primary tracking-tight">${temp}°C</div>
        <div class="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-green-600 animate-ping"></span> Live Sector Metric
        </div>
      </div>

      <!-- Humidity Metric -->
      <div class="p-6 bg-surface-container border border-outline-variant rounded-xl space-y-2 hover:border-primary transition-all duration-300 group">
        <div class="flex justify-between items-center text-secondary group-hover:text-primary transition-colors">
          <span class="font-display-lg text-[10px] uppercase tracking-widest font-bold">Humidity Level</span>
          <span class="material-symbols-outlined text-[18px]">humidity_percentage</span>
        </div>
        <div class="font-display-lg text-3xl font-bold text-primary tracking-tight">${humidity}%</div>
        <div class="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-green-600 animate-ping"></span> Live Sector Metric
        </div>
      </div>

      <!-- Wind Speed Metric -->
      <div class="p-6 bg-surface-container border border-outline-variant rounded-xl space-y-2 hover:border-primary transition-all duration-300 group">
        <div class="flex justify-between items-center text-secondary group-hover:text-primary transition-colors">
          <span class="font-display-lg text-[10px] uppercase tracking-widest font-bold">Wind Velocity</span>
          <span class="material-symbols-outlined text-[18px]">air</span>
        </div>
        <div class="font-display-lg text-3xl font-bold text-primary tracking-tight">${wind} km/h</div>
        <div class="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-green-600 animate-ping"></span> Live Sector Metric
        </div>
      </div>
    `;
  };

  useEffect(() => {
    const currentSectorKey = getSector();
    const sectorInfo = coordinates[currentSectorKey];
    if (!sectorInfo) return;

    let isMounted = true;
    renderLoading();

    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${sectorInfo.lat}&longitude=${sectorInfo.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Satellite signal lost');
        }

        const data = await response.json();
        
        if (isMounted) {
          if (data && data.current) {
            renderMetrics(data.current, sectorInfo.name);
          } else {
            throw new Error('Data payload corrupted');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error(`Failed to fetch sector data for ${sectorInfo.name}:`, err);
          renderError(err.message || 'Connection offline');
        }
      }
    };

    fetchWeather();

    // Return cleanup function to cancel any pending state updates if dependencies change before request finishes
    return () => {
      isMounted = false;
    };
  }, [getSector]);
});
