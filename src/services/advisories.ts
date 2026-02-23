import { XMLParser } from 'fast-xml-parser';
import { logger } from '../utils/logger.js';
import { NJTransitAdvisory } from '../utils/types.js';
import axios from 'axios';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

const RSS_URLS = {
  lightRail: 'http://njtransit.com/rss/LightRailAdvisories_feed.xml',
} as const;

export async function getLightRailAdvisories(): Promise<
  NJTransitAdvisory[]
> {
  try {
    logger.debug('Fetching Light Rail advisories...');

    const response = await axios.get(RSS_URLS.lightRail);
    const result = parser.parse(response.data);

    const items = result.rss.channel.item;

    logger.info(`Found ${items.length} advisories`);

    return Array.isArray(items) ? items : [items];
  } catch (error) {
    logger.error('Failed to fetch advisories:', error);
    throw error;
  }
}

// Check for new advisories since last check
const seenAdvisories = new Set<string>();

export async function getNewAdvisories(): Promise<
  NJTransitAdvisory[]
> {
  const advisories = await getLightRailAdvisories();

  const newAdvisories = advisories.filter((advisory) => {
    const id = advisory.guid || advisory.link;
    if (seenAdvisories.has(id)) {
      return false;
    }
    seenAdvisories.add(id);
    return true;
  });

  return newAdvisories;
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
export async function hasActiveDelays(): Promise<boolean> {
  const advisories = await getLightRailAdvisories();

  const delayKeywords = [
    'delay',
    'suspended',
    'cancelled',
    'modified service',
    'service change',
  ];

  const delays = filterAdvisories(advisories, delayKeywords);

  return delays.length > 0;
}
