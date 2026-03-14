import { XMLParser } from 'fast-xml-parser';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';
import { NJTransitAdvisory } from '../utils/types.js';
import axios from 'axios';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

export async function getLightRailAdvisories(): Promise<
  NJTransitAdvisory[]
> {
  try {
    logger.debug('Fetching Light Rail advisories...');

    const response = await axios.get(env.NJ_TRANSIT_LIGHT_RAIL_ADVISORIES_RSS);
    const result = parser.parse(response.data);

    const items = result.rss.channel.item;

    logger.info(`Found ${items.length} advisories`);

    return Array.isArray(items) ? items : [items];
  } catch (error) {
    logger.error('Failed to fetch advisories:', error);
    throw error;
  }
}

// Return advisories published within the last `windowMinutes` minutes.
// Stateless — no in-memory set needed, safe for ephemeral containers.
export async function getNewAdvisories(
  windowMinutes = 20,
): Promise<NJTransitAdvisory[]> {
  const advisories = await getLightRailAdvisories();
  const cutoff = Date.now() - windowMinutes * 60 * 1000;

  return advisories.filter((advisory) => {
    const published = new Date(advisory.pubDate).getTime();
    return !isNaN(published) && published >= cutoff;
  });
}

// Filter advisories by keywords
export function filterAdvisories(
  advisories: NJTransitAdvisory[],
  keywords: string[],
): NJTransitAdvisory[] {
  return advisories.filter((advisory) => {
    const text =
      `${advisory.title} ${advisory.description || ''}`.toLowerCase();
    return keywords.some((keyword) =>
      text.includes(keyword.toLowerCase()),
    );
  });
}

// Check if there are any service alerts/delays
export async function advisoriesWithDelays(windowMinutes = 20): Promise<NJTransitAdvisory[]> {
  const advisories = await getNewAdvisories(windowMinutes);

  const delayKeywords = [
    'delay',
    'suspended',
    'cancelled',
    'modified service',
    'service change',
  ];

  const delayedAdvisories = filterAdvisories(advisories, delayKeywords);

  return delayedAdvisories;
}
