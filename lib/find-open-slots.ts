import { getCalendarData } from "@/lib/get-calendar-data";

function minutesToMilitary(minutes: number) {
  let hours = Math.floor(minutes / 60);
  let mins = minutes % 60;
  return hours * 100 + mins;
}

function militaryToMinutes(military: number) {
  let hours = Math.floor(military / 100);
  let mins = military % 100;
  return hours * 60 + mins;
}

// duration: minutes
export async function findOpenSlots(duration: number, daySpecify: string | null) {
  let openTimes: TimeSlot[] = [];
  const wakeUpTime = 900;
  const bedTime = 2200;

  const data = (await getCalendarData());
  if (data) {
    data.forEach((day: Day) => {
      // if there aren't any events scheduled at 9 AM, schedule an event
      if (day.events[0].endTime > 900) {
        day.events.unshift({
          name: "filler",
          startTime: wakeUpTime,
          endTime: wakeUpTime,
          description: "wake up time",
        });
      }


      // if there aren't any events ending after 10 PM, schedule an event
      if (day.events[day.events.length - 1].endTime < 2200) {
        day.events.push({
          name: "filler",
          startTime: bedTime,
          endTime: bedTime,
          description: "bedtime",
        });
      }

      // look at gaps between events, add timeSlot to openTimes if >= duration
      let lastEvent: number | null = null;
      day.events.forEach((event: CalendarEvent) => {
        if (daySpecify !== null && daySpecify !== day.name) {
          return;
        }
        if (lastEvent) {
          if (
            militaryToMinutes(event.startTime) - militaryToMinutes(lastEvent) >=
            duration
          ) {
            openTimes.push({
              date: day.name,
              startTime: lastEvent,
              endTime: event.startTime,
            });
          }
        }
        lastEvent = event.endTime;
      });
    });
  }
  return openTimes;
}

export async function checkConflict(time: TimeSlot) {
  let hasConflict = false;

  const data = await getCalendarData();
  if (data) {
    data.forEach((day: Day) => {
      if (day.name === time.date) {
        day.events.forEach((event: CalendarEvent) => {
          if (
            (time.startTime < event.startTime && time.endTime > event.endTime) ||
            (time.startTime >= event.startTime &&
              time.startTime < event.endTime) ||
            (time.endTime > event.startTime && time.endTime <= event.endTime)
          ) {
            hasConflict = true;
          }
        });
      }
    });
  }

  return hasConflict;
}

export async function findEventsAtTime(day: string, time: number) {
  let events: CalendarEvent[] = [];

  const data = await getCalendarData();
  if (data) {
    data?.forEach((d: Day) => {
      if (d.name === day) {
        d.events.forEach((e: CalendarEvent) => {
          if (e.startTime <= time && e.endTime >= time) {
            events.push(e);
          }
        });
      }
    });
  }

  return events;
};
