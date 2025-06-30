const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReminder = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Whitecircle Group" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`Reminder sent to ${to}`);
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
};

module.exports = sendReminder;
