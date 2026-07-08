const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');
const productsRoutes = require('./routes/products.routes');
const cartRoutes = require('./routes/cart.routes');
const contactRoutes = require('./routes/contact.routes');
const authRoutes = require('./routes/auth.routes');
const checkoutRoutes = require('./routes/checkout.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from root
app.use(express.static(path.join(__dirname, '../../')));

// Serve root index.html with the loading screen
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api', authRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`SneakerLabs backend running on port ${env.port}`);
});
