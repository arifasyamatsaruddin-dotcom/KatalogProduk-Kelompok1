function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function setMessage(target, message, type = 'info') {
  if (!target) return;

  target.dataset.type = type;
  target.className = 'sneaker-state';

  if (type === 'error') {
    target.classList.add('sneaker-state--error');
  } else if (type === 'success') {
    target.classList.add('sneaker-state--success');
  }

  if (type === 'loading') {
    target.innerHTML = `
      <div class="sneaker-loading" role="status" aria-live="polite">
        <span class="sneaker-loading__dot"></span>
        <span class="sneaker-loading__dot"></span>
        <span class="sneaker-loading__dot"></span>
        <span>${message}</span>
      </div>`;
    return;
  }

  target.textContent = message;
}

function setLoadingMessage(target, message = 'Loading...') {
  setMessage(target, message, 'loading');
}

/**
 * Custom useState hook for Vanilla JS reactivity.
 * @param {*} initialValue 
 * @returns {Array}
 */
function useState(initialValue) {
  let state = initialValue;
  const listeners = [];

  const getState = () => state;

  const setState = (newValue) => {
    const oldValue = state;
    if (typeof newValue === 'function') {
      state = newValue(state);
    } else {
      state = newValue;
    }

    if (oldValue !== state) {
      listeners.forEach((listener) => listener(state, oldValue));
    }
  };

  const subscribe = (listener) => {
    if (typeof listener === 'function') {
      listeners.push(listener);
    }
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  };

  // Attach subscribe and listeners directly to the getter so they can be inspected/used by other hooks
  getState.subscribe = subscribe;
  getState.listeners = listeners;

  return [getState, setState, subscribe];
}

/**
 * Custom useEffect hook for Vanilla JS side-effects.
 * Runs callback on mount and when dependencies change.
 * Support standard values and useState getters in dependency array.
 * @param {Function} callback - The effect callback.
 * @param {Array} [deps] - Dependency array.
 */
function useEffect(callback, deps) {
  let cleanup;
  let lastDepValues = deps ? deps.map(dep => typeof dep === 'function' ? dep() : dep) : null;

  const runEffect = () => {
    if (typeof cleanup === 'function') {
      try {
        cleanup();
      } catch (err) {
        console.error("Error in useEffect cleanup:", err);
      }
    }
    cleanup = callback();
  };

  // Run initially (mount)
  runEffect();

  // If dependency array is provided and not empty, subscribe to updates
  if (deps && Array.isArray(deps)) {
    deps.forEach((dep) => {
      if (typeof dep === 'function' && typeof dep.subscribe === 'function') {
        dep.subscribe(() => {
          const currentDepValues = deps.map(d => typeof d === 'function' ? d() : d);
          const hasChanged = !lastDepValues || currentDepValues.some((val, idx) => val !== lastDepValues[idx]);
          if (hasChanged) {
            lastDepValues = currentDepValues;
            runEffect();
          }
        });
      }
    });
  }
}

// Export globally for easy access across script files
window.useState = useState;
window.useEffect = useEffect;

