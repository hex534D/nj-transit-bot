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
  date?: string; // Optional, format: "MM/DD/YYYY" or similar
};