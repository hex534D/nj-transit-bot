import { getNextTrain, getUpcomingTrains } from '../services/njTransit.js';
import { telegram } from '../services/notifications.js';
import { logger } from '../utils/logger.js';
import { formatDate, formatTripDuration } from '../utils/util.js';

export async function checkCommute(timeOfDay = 'morning') {
  logger.info(`Checking ${timeOfDay} commute trains...`);

  try {
    const params = {
      line: 'Hudson-Bergen Light Rail',
      origin: '22nd Street Station (Bayonne)',
      destination: 'Newport Light Rail Station',
      date: formatDate(new Date()),
    };

    // Get next train
    const nextTrain = await getNextTrain(params);

    if (!nextTrain) {
      await telegram.sendMessage(
        '⚠️ No trains found for your route',
        {
          title: `🚆 ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Commute`,
        },
      );
      return;
    }

    // Get all trains in next 2 hours
    const upcomingTrains = await getUpcomingTrains(params, 2);

    const message = [
      `🚆 *Next Train*`,
      formatTripDuration(nextTrain),
      '',
      `📋 *Upcoming (${upcomingTrains.length} trains)*`,
      ...upcomingTrains
        .slice(0, 5)
        .map((trip, i) => `${i + 1}. ${formatTripDuration(trip)}`),
    ].join('\n');

    await telegram.sendMessage(message, {
      title: `🌅 ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Commute`,
    });

    logger.info(`${timeOfDay} commute alert sent`);
  } catch (error) {
    logger.error(`Failed to check ${timeOfDay} commute:`, error);
  }
}
