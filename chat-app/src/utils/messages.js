// Utility functions for generating message objects

// For normal text messages
export const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}
// For location messages

export const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}
