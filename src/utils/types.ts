export interface NotificationOptions {
  title?: string;
  priority?: 'low' | 'normal' | 'high';
  silent?: boolean;
}

export type Trips = {
  arrival: {
    time: string;
  };
  departure: {
    time: string;
  };
};

export type LightRailScheduleResponse = {
  getLightRailSchedule: {
    trips: Trips[];
  };
};

export type ScheduleParams = {
  line: string;
  origin: string;
  destination: string;
  date?: string; // format: "MM/DD/YYYY" or similar
};

// Custom fields for NJ Transit RSS (if they have custom fields)
export type NJTransitAdvisory = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  advisoryAlert?: string;
  guid: string;
}