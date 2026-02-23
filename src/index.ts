import cron from 'node-cron';
import { checkCommute } from './jobs/commute.js';
import { logger } from './utils/logger.js';
import { env } from './config/env.js';
import { monitorAdvisories } from './jobs/advisoryMonitor.js';

async function main() {
  logger.info('NJ Transit Bot starting...');
  logger.info(`Environment: ${env.NODE_ENV}`);

  // Morning commute check: Mon-Fri at 8:00 AM
  cron.schedule('0 8 * * 1-5', async () => {
    await checkCommute();
  });

  // Evening commute check: Mon-Fri at 4:00 PM
  cron.schedule('0 16 * * 1-5', async () => {
    await checkCommute('evening');
  });

  // Real-time monitoring: Every 15 minutes for advisories
  cron.schedule('*/15 * * * *', async () => {
    await monitorAdvisories();
  });

  logger.info('Cron jobs scheduled. Bot is running...');
}

main().catch((error) => {
  logger.error('Bot failed to start:', error);
  process.exit(1);
});
