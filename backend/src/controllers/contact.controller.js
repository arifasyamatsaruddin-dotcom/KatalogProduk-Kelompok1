const contactService = require('../services/contact.service');

function submitContact(req, res, next) {
  try {
    const message = contactService.submitContact(req.body);
    res.status(201).json({ message: 'Contact message received', data: message });
  } catch (error) {
    next(error);
  }
}

module.exports = { submitContact };
