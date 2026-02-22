import { GraphQLClient } from 'graphql-request';
import { env } from '../config/env.ts';
import {
  LightRailScheduleResponse,
  ScheduleParams,
  Trips,
} from '../utils/types.ts';
import { getLocalTime, parseTime } from '../utils/util.ts';

const client = new GraphQLClient(env.NJ_TRANSIT_API_URL);

const lightRailScheduleQuery = `
    query LightRailSchedule($line: String!, $origin: String!, $destination: String!, $date: String) {
      getLightRailSchedule(
        line: $line
        origin: $origin
        destination: $destination
        date: $date
      ) {
        trips {
          arrival {
            time
          }
          departure {
            time
          }
        }
      }
    }
  `;

export async function getLightRailSchedule(params: ScheduleParams): Promise<Trips[]> {
  const response = await client.request<LightRailScheduleResponse>(
    lightRailScheduleQuery,
    params,
  );

  console.log(response);

  return response.getLightRailSchedule?.trips;
}

export async function getStationTitles(
  line: string,
): Promise<string[]> {
  const query = `
    query GetStations($title: String!) {
      getTrainScheduleStationsLightRailForSchedulesLine(title: $title) {
        title
      }
    }
  `;

  const response = await client.request<{
    getTrainScheduleStationsLightRailForSchedulesLine: Array<{
      title: string;
    }>;
  }>(query, { title: line });

  // Transform to simple string array
  return response.getTrainScheduleStationsLightRailForSchedulesLine.map(
    (station: { title: string }) => station.title,
  );
}

// Helper: Get next train
export async function getNextTrain(
  params: ScheduleParams,
): Promise<Trips | null> {
  const trips = await getLightRailSchedule(params);

  // if (trips.length === 0) return null;
  console.log(params);
  console.log(trips);

  const currentTime = getLocalTime();

  // Find first train departing after current time
  const nextTrip = trips.find(
    (trip) => trip.departure.time > currentTime,
  );

  return nextTrip || null;
}

// Helper: Get trains in next N hours
export async function getUpcomingTrains(
  params: ScheduleParams,
  hours: number = 2,
): Promise<Trips[]> {
  const trips = await getLightRailSchedule(params);
  const now = new Date();

  return trips.filter((trip) => {
    const departureTime = parseTime(trip.departure.time);
    const diffMs = departureTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours >= 0 && diffHours <= hours;
  });
}
