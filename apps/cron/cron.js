// import { CronJob } from 'cron';
require('dotenv').config();
const { CronJob } = require('cron');

console.log('CRON RUNNING...');

/**
 * "* * * * * *"
 * asterisk pertama => second
 * minute
 * hour
 * day
 * month
 * "0 * * * * *" => run setiap detik ke-0
 */
const job = CronJob.from({
  cronTime: '0 * * * * *', // perjam atau menit ke 0
  onTick: async function () {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/transaction/cron`,
        {
          method: 'POST',
        },
      );
      const message = await response.json();
      console.log(message);
    } catch (e) {
      console.error(e);
    }
  },
  start: true,
  timeZone: 'Asia/Jakarta',
});
