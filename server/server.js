const app = require('./src/app');
require('../server/src/jobs/reminder.job'); // Import the reminder job to start the cron job



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
