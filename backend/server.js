const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const usersFile = path.join(__dirname, 'data', 'users.json');

app.use(cors());
app.use(express.json());

function ensureUsersFile() {
  if (!fs.existsSync(usersFile)) {
    fs.mkdirSync(path.dirname(usersFile), { recursive: true });
    const seedUsers = [
      {
        email: 'demo@sneakerlabs.com',
        password: hashPassword('demo123')
      }
    ];
    fs.writeFileSync(usersFile, JSON.stringify(seedUsers, null, 2));
  }
}

function loadUsers() {
  ensureUsersFile();
  return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createToken() {
  return crypto.randomUUID();
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi.' });
  }

  const users = loadUsers();
  const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    return res.status(409).json({ message: 'Email sudah terdaftar.' });
  }

  users.push({ email, password: hashPassword(password) });
  saveUsers(users);

  const token = createToken();
  res.status(201).json({ token, user: { email } });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi.' });
  }

  const users = loadUsers();
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ message: 'Email atau password salah.' });
  }

  const token = createToken();
  res.json({ token, user: { email: user.email } });
});

app.get('/api/me', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({ message: 'Token tidak valid.' });
  }

  res.json({ authenticated: true, token });
});

app.listen(PORT, () => {
  console.log(`Backend berjalan di http://localhost:${PORT}`);
});
