const { addMessage } = require('../models/contact.model');

function submitContact(message) {
  if (!message.name || !message.email || !message.subject || !message.message) {
    const error = new Error('All contact fields are required');
    error.statusCode = 400;
    throw error;
  }

  return addMessage(message);
}

module.exports = { submitContact };
