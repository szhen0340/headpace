type Calendar = {
  days: Day[];
};

type Day = {
  name: string;
  events: CalendarEvent[];
};

type CalendarEvent = {
  name: string;
  startTime: number;
  endTime: number;
  description: string;
};

type TimeSlot = {
  date: string;
  startTime: number;
  endTime: number;
};
