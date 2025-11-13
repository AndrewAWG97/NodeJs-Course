// Utility functions for generating message objects

// For normal text messages
export function generateMessage(text) {
  return {
    text,
    createdAt: new Date().getTime(),
  };
}

// For location messages
export function generateLocationMessage(url) {
  return {
    url, 
    createdAt: new Date().getTime(),
  };
}
