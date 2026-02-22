import { Trips } from './types';

// Returns current time in AM/PM format
export const getLocalTime = () =>
  new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

export const formatDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Utility: Parse "06:11 AM" to Date object
export const parseTime = (timeStr: string): Date => {
  const now = new Date();
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);

  let hour24 = hours;
  if (period === 'PM' && hours !== 12) hour24 += 12;
  if (period === 'AM' && hours === 12) hour24 = 0;

  const date = new Date(now);
  date.setHours(hour24, minutes, 0, 0);

  return date;
};

// Utility: Format trip info
export function formatTrip(trip: Trips): string {
  return `Departs: ${trip.departure.time} → Arrives: ${trip.arrival.time}`;
}

export function formatTripDuration(trip: Trips): string {
  const departure = parseTime(trip.departure.time);
  const arrival = parseTime(trip.arrival.time);
  const durationMs = arrival.getTime() - departure.getTime();
  const durationMin = Math.round(durationMs / (1000 * 60));

  return `${formatTrip(trip)} (${durationMin} min)`;
}
