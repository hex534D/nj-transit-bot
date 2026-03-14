import cron from 'node-cron';
import { checkCommute } from './jobs/commute.js';
import { logger } from './utils/logger.js';
import { env } from './config/env.js';
import { monitorAdvisories } from './jobs/advisoryMonitor.js';

async function main() {
  logger.info('NJ Transit Bot starting...');
  logger.info(`Environment: ${env.NODE_ENV}`);

  // Morning commute check: Mon-Fri at 8:00 AM, +4 adjusting according to railway UTC time
  cron.schedule('0 12 * * 1-5', async () => {
    await checkCommute();
  });

  // Evening commute check: Mon-Fri at 4:00 PM
  cron.schedule('0 20 * * 1-5', async () => {
    await checkCommute('evening');
  });

  // Advisory monitoring: Every 15 min on weekdays 7 AM – 8 PM
  cron.schedule('*/15 7-20 * * 1-5', async () => {
    await monitorAdvisories(15);
  });

  logger.info('Cron jobs scheduled. Bot is running...');
}

main().catch((error) => {
  logger.error('Bot failed to start:', error);
  process.exit(1);
});
