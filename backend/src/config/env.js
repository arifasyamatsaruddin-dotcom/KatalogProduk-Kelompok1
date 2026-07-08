require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  gmailUser: process.env.GMAIL_USER || '',
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || '',
  mailFrom: process.env.MAIL_FROM || process.env.GMAIL_USER || '',
  companyName: process.env.COMPANY_NAME || 'Sneaker Labs',
  companyEmail: process.env.COMPANY_EMAIL || 'hello@sneakerlabs.com',
  companyPhone: process.env.COMPANY_PHONE || '+62 812-3456-7890',
  companyAddress: process.env.COMPANY_ADDRESS || 'Jakarta, Indonesia'
};
