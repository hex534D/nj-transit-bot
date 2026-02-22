import cron from 'node-cron';
import { checkMorningCommute } from './jobs/morningCommute.js';
import { logger } from './utils/logger.js';
import { env } from './config/env.js';

async function main() {
  logger.info('NJ Transit Bot starting...');
  logger.info(`Environment: ${env.NODE_ENV}`);

  // Morning commute check: Mon-Fri at 8:00 AM
  cron.schedule('0 8 * * 1-5', async () => {
    await checkMorningCommute();
  });

  // Real-time monitoring: Every 5 minutes during commute hours
  cron.schedule('*/5 7-9,17-19 * * 1-5', async () => {
    logger.info('Running real-time monitoring...');
    // Your real-time monitoring logic - TODO - Light Rail Advisories feed
  });

  logger.info('Cron jobs scheduled. Bot is running...');
}

main().catch((error) => {
  logger.error('Bot failed to start:', error);
  process.exit(1);
});
