const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.example.com', 
    port: 587, 
    secure: false, // Set to true if you're using SSL/TLS
    auth: {
        user: 'your-email@example.com', /
        pass: 'your-password' 
});

let mailOptions = {
    from: 'your-email@example.com',
    to: 'recipient@example.com', 
    subject: 'Test Email', 
    text: 'Hello from Node.js!', 
    html: '<b>Hello from <i>Node.js</i>!</b>' 
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error occurred:', error.message);
    }
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
});
