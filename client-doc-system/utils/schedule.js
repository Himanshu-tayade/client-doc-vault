const cron = require('node-cron');
const Document = require('../models/Document');
const User = require('../models/User');
const sendReminder = require('./mailer');

// Runs every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('[Cron Job] Checking for documents nearing expiry...');

  try {
    const now = new Date();
    const threeDaysLater = new Date(now);
    threeDaysLater.setDate(now.getDate() + 3);

    const documents = await Document.find({
      expiryDate: { $gte: now, $lte: threeDaysLater },
    }).populate('clientId');

    for (const doc of documents) {
      const userEmail = doc.clientId.email;
      const subject = `📄 Reminder: "${doc.name}" expires soon`;
      const text = `Hello ${doc.clientId.name},\n\nYour document "${doc.name}" is expiring on ${doc.expiryDate.toDateString()}.\nPlease take necessary action.\n\n- Whitecircle Group`;

      await sendReminder(userEmail, subject, text);
    }
  } catch (err) {
    console.error('Error during cron job:', err.message);
  }
});
