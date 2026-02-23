import { XMLParser } from 'fast-xml-parser';
import axios from 'axios';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

export async function getLightRailAdvisories() {
  const response = await axios.get(
    'http://njtransit.com/rss/LightRailAdvisories_feed.xml',
  );
  const result = parser.parse(response.data);

  const items = result.rss.channel.item;

  const advisories = Array.isArray(items) ? items : [items];

  console.log(advisories)
}


getLightRailAdvisories();
