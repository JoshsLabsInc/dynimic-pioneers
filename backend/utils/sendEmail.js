const nodemailer = require('nodemailer');

const sendResetEmail = async (email, resetUrl) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Dynamic Pioneers - Password Reset',
        html: `
        <p>You requested a password reset for your Dynamic Pioneers account.</p>
        <p>Click this link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 30 minutes.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };