import { NextRequest } from "next/server";
import { OpenAI } from "openai";

import { findOpenSlots, checkConflict, findEventsAtTime } from "@/lib/find-open-slots";
import { findMultipleOpenSlots } from "@/lib/find-multiple-open-slots";
import { insertEvent } from "@/lib/insert-event";
import { getCalendarData } from "@/lib/get-calendar-data";

const client = (process.env.NO_AI?.toString().trim() != "true") ? new OpenAI() : undefined as unknown as OpenAI;

export async function POST(req: NextRequest) {
  const { history, prompt } = await req.json();
  if (!prompt || !history) {
    return new Response(null, {
      status: 400,
      statusText: "Did not include correct parameters",
    });
  }

  if (process.env.NO_AI?.toString().trim() == "true") {
    // reject with boilerplate message
    return new Response(
      JSON.stringify(
        "Sorry, the AI feature is disabled. Please deploy locally to use the AI feature with your own API Keys."
      ),
    );
  }

  const data = await getCalendarData("calendar1");

  if (!data) {
    return new Response(null, {
      status: 500,
      statusText: "Failed to get calendar data",
    });
  }

  const runner = client.beta.chat.completions.runTools({
    model: "gpt-4-turbo-preview",
    //model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a helpful calendar assistant. You will use tool calls to answer the user's request.
If the user wants to know all available time slots, call the findOpenSlots tool.
If the user wants to check for a conflict or whether adding a new event is feasible, call the checkConflict tool.
If available, list all time slots. Be friendly.
The day name should always be in the format mm/dd/yyyy.
If the user requests to insert events to both calendars, call the setEvent tool twice for both calendars.

The owner of the user, Sam, has database named 'calendar1'.
His friend, Kevin, has a database named 'calendar2'.

Today's date is ${new Date().toLocaleDateString()}.
It is currently ${new Date().toLocaleTimeString()}.
`,
      },
      ...history,
      {
        role: "user",
        content: `Here is my list of events:\n${JSON.stringify(data)}`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          function: findOpenSlotsCall,
          parse: JSON.parse,
          description:
            "Given a duration in minutes, finds all open slots in the user's calendar available for that duration. Returns an array of available time slots.",
          parameters: {
            type: "object",
            properties: {
              duration: {
                description:
                  "The duration in minutes of the event to be scheduled.",
                type: "integer",
              },
              daySpecify: {
                description:
                  "The name of the day the event must be scheduled on. If no day is specified, then this argument should be empty string.",
                type: "string",
              },
              calendar: {
                description:
                  "The name of the calendar to be used. Use the appropriate database you desire, Sam uses 'calendar1', Kevin uses 'calendar2'.",
                type: "string",
              },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          function: checkConflictCall,
          parse: JSON.parse,
          description:
            "Given a day name, start time (military), and end time (military), checks if there is a conflict with an existing event. Returns `true` if there is a conflict, otherwise `false` if no conflict.",
          parameters: {
            type: "object",
            properties: {
              day: {
                description:
                  "The name of the day the event is to be scheduled on.",
                type: "string",
              },
              start: {
                description:
                  "The start time of the event in military format. Military format is an integer of the form hhmm where hh is the hour and mm is the minute.",
                type: "integer",
              },
              end: {
                description:
                  "The end time of the event in military format. Military format is an integer of the form hhmm where hh is the hour and mm is the minute.",
                type: "integer",
              },
              calendar: {
                description:
                  "The name of the calendar to be used. Use the appropriate database you desire, Sam uses 'calendar1', Kevin uses 'calendar2'.",
                type: "string",
              },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          function: findEventsAtTimeCall,
          parse: JSON.parse,
          description:
            "Given a day name and time (military), finds all events that are scheduled at that time. Returns an array of events that are scheduled at that time.",
          parameters: {
            type: "object",
            properties: {
              day: {
                description:
                  "The name of the day the event is to be scheduled on.",
                type: "string",
              },
              time: {
                description:
                  "The time wanted in military format. Military format is an integer of the form hhmm where hh is the hour and mm is the minute.",
                type: "integer",
              },
              calendar: {
                description:
                  "The name of the calendar to be used. Use the appropriate database you desire, Sam uses 'calendar1', Kevin uses 'calendar2'.",
                type: "string",
              },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          function: setEventCall,
          parse: JSON.parse,
          description:
            "Given a day name, start time (military), duration in minutes, description, and name, sets an event in the user's calendar. Before using, check for conflicts for the time slot. Returns `true` if the event was successfully set, otherwise `false` if the event could not be set.",
          parameters: {
            type: "object",
            properties: {
              date: {
                description:
                  "The name of the day the event is to be scheduled on.",
                type: "string",
              },
              startTime: {
                description:
                  "The start time of the event in military format. Military format is an integer of the form hhmm where hh is the hour and mm is the minute.",
                type: "integer",
              },
              duration: {
                description:
                  "The duration in minutes of the event to be scheduled.",
                type: "integer",
              },
              description: {
                description:
                  "The description of the event to be scheduled. If the user doesn't specify, summarize for them.",
                type: "string",
              },
              name: {
                description:
                  "The name of the event to be scheduled.",
                type: "string",
              },
              calendar: {
                description:
                  "The name of the calendar to be used. Use the appropriate database you desire, Sam uses 'calendar1', Kevin uses 'calendar2'.",
                type: "string",
              },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          function: findMultipleOpenSlotsCall,
          parse: JSON.parse,
          description:
            "Given a duration in minutes and a day name, find all time slots for which both Sam and Kevin are free. Returns an array of available time slots.",
          parameters: {
            type: "object",
            properties: {
              duration: {
                description:
                  "The duration in minutes of the event to be scheduled.",
                type: "integer",
              },
              daySpecify: {
                description:
                  "The name of the day the event must be scheduled on. This must be a valid day.",
                type: "string",
              },
            },
          },
        },
      },
    ],
  });
  return new Response(JSON.stringify(await runner.finalContent()));
}

async function findOpenSlotsCall(args: {
  duration: number;
  daySpecify: string;
  calendar: string;
}) {
  const { duration, daySpecify, calendar } = args;
  return await findOpenSlots(duration, daySpecify === "" ? null : daySpecify, calendar);
}

async function checkConflictCall(args: {
  day: string;
  start: number;
  end: number;
  calendar: string;
}) {
  const { day, start, end, calendar } = args;
  return await checkConflict(
    {
      date: day,
      startTime: start,
      endTime: end
    },
    calendar
  );
}

async function findEventsAtTimeCall(args: {
  day: string;
  time: number;
  calendar: string;
}) {
  const { day, time, calendar } = args;
  return await findEventsAtTime(day, time, calendar);
}

async function setEventCall(args: {
  date: string;
  startTime: number;
  duration: number;
  description: string;
  name: string;
  calendar: string;
}) {
  const { date, startTime, duration, description, name, calendar } = args;
  console.log(args);
  return await insertEvent(date, startTime, duration, description, name, calendar);
}

async function findMultipleOpenSlotsCall(args: {
  duration: number;
  daySpecify: string;
}) {
  const { duration, daySpecify } = args;
  let res = await findMultipleOpenSlots(duration, daySpecify);
  console.log(res);
  return res;
}
