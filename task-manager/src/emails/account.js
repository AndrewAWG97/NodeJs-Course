const sgMail = require('@sendgrid/mail')

// Load API key from env
sgMail.setApiKey(process.env.SENDGRID_KEY)

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL, // Verified sender email from .env
        subject: 'Welcome to our app 🎉',
        text: `Hi ${name}, welcome to our service! Let us know if you need help.`,
        html: `<strong>Hi ${name}</strong>,<br>Welcome to our app! 🎉 We're excited to have you with us.`,
    }

    return sgMail.send(msg)
}

const sendCancelEmail = (email, name) => {
    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: 'Sorry to see you go 😢',
        text: `Goodbye ${name}. We’re sad to see you leave 😔.`,
        html: `<strong>Goodbye ${name}</strong>,<br>We're sad to see you leave. If we could have done better, please tell us.`,
    }

    return sgMail.send(msg)
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}
