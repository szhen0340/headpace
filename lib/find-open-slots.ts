import data from "@/data.json";

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
export function findOpenSlots(duration: number, daySpecify: string | null) {
  let openTimes: TimeSlot[] = [];
  const wakeUpTime = 900;
  const bedTime = 2200;
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
            endTime: event.endTime,
          });
        }
      }
      lastEvent = event.endTime;
    });
  });

  return openTimes;
}

export function checkConflict(time: TimeSlot) {
  let hasConflict = false;

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

  return hasConflict;
}
