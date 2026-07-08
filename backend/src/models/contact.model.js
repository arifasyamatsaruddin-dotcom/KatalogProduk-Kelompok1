let messages = [];
let nextId = 1;

function addMessage(message) {
  const newMessage = {
    id: nextId++,
    ...message,
    createdAt: new Date().toISOString()
  };
  messages.push(newMessage);
  return newMessage;
}

module.exports = { addMessage };
