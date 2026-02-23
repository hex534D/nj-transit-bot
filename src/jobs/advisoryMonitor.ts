import { getNewAdvisories } from '../services/advisories.js';
import { formatAdvisory } from '../utils/formatter.js';
import { telegram } from '../services/notifications.js';
import { logger } from '../utils/logger.js';

export async function monitorAdvisories() {
  logger.info('Checking for new advisories...');

  try {
    const newAdvisories = await getNewAdvisories();

    if (newAdvisories.length === 0) {
      logger.debug('No new advisories');
      return;
    }

    logger.info(`Found ${newAdvisories.length} new advisory(ies)`);

    // Send each new advisory as a separate message
    for (const advisory of newAdvisories) {
      await telegram.sendMessage(formatAdvisory(advisory), {
        title: '🚨 NJ Transit Alert',
        priority: 'high',
      });
    }
  } catch (error) {
    logger.error('Advisory monitoring failed:', error);
  }
}
