import { useEffect, useState } from 'react';

function App() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('loginUser') || localStorage.getItem('sneakerlabs-user');
    if (savedUser) {
      setUser({ email: savedUser });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan');
      }

      localStorage.setItem('loginUser', data.user.email);
      localStorage.setItem('loginProvider', 'backend');
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('sneakerlabs-user', JSON.stringify(data.user));
      localStorage.setItem('sneakerlabs-token', data.token);
      setUser(data.user);
      setMessage(mode === 'login' ? 'Login berhasil!' : 'Akun berhasil dibuat!');
      setPassword('');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loginUser');
    localStorage.removeItem('loginProvider');
    localStorage.removeItem('authToken');
    localStorage.removeItem('sneakerlabs-user');
    localStorage.removeItem('sneakerlabs-token');
    setUser(null);
    setMessage('Anda berhasil logout.');
  };

  return (
    <div className="app-shell">
      <div className="auth-card">
        <h1>Sneaker Labs</h1>
        <p>Login atau daftar untuk mulai berbelanja.</p>

        {user ? (
          <div className="user-panel">
            <p>Halo, {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={() => window.location.href = 'http://localhost:8000/KatalogProduk-Kelompok1-main/'}>Kembali ke Website</button>
          </div>
        ) : (
          <>
            <div className="toggle-row">
              <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
                Login
              </button>
              <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
                Daftar
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Buat Akun'}
              </button>
            </form>
          </>
        )}

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default App;
