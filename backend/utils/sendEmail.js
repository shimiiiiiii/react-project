const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
        port: process.env.SMTP_PORT || 2525,
        auth: {
            user: process.env.SMTP_EMAIL || '904cd0360be788',
            pass: process.env.SMTP_PASSWORD || 'f5003dc1789e00'
        }
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME || 'YourApp'} <${process.env.SMTP_FROM_EMAIL || 'no-reply@yourapp.com'}>`,
        to: options.email,
        subject: options.subject,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
            </head>
            <body>
                <h1>Email Verification</h1>
                <p>${options.message}</p>
                <p>Please click the link below to verify your email:</p>
                <p>
                    <a href="${options.url}" target="_blank" style="color: blue; text-decoration: underline;">Verify Email</a>
                </p>
                <p>If you did not register, please ignore this email.</p>
            </body>
            </html>
        `
    };

    await transporter.sendMail(message);
};

module.exports = sendEmail;
