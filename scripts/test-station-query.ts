import { GraphQLClient } from 'graphql-request';
import dotenv from 'dotenv';

dotenv.config({path: '.env.development'});

const client = new GraphQLClient(
  process.env.NJ_TRANSIT_API_URL || '',
);

async function testStationQuery() {
  const query = `
    query GetStations($title: String!) {
      getTrainScheduleStationsLightRailForSchedulesLine(title: $title) {
        title
      }
    }
  `;

  try {
    console.log('🔍 Testing GraphQL query...\n');
    console.log('Query:', query);
    console.log('Variables:', { title: 'Hudson-Bergen Light Rail' });
    console.log('\n---\n');

    const response: any = await client.request(query, {
      title: 'Hudson-Bergen Light Rail',
    });

    console.log('✅ Raw Response:');
    console.log(JSON.stringify(response, null, 2));

    // Transform to array
    const stations =
      response.getTrainScheduleStationsLightRailForSchedulesLine.map(
        (s: any) => s.title,
      );

    console.log('\n✅ Transformed to string array:');
    console.log(stations);
  } catch (error: any) {
    console.error('❌ Query failed:', error);
    if (error.response) {
      console.error('Response errors:', error.response.errors);
    }
    process.exit(1);
  }
}

testStationQuery();
