import { NextRequest } from "next/server";
import { OpenAI } from "openai";

import { findOpenSlots, checkConflict, findEventsAtTime } from "@/lib/find-open-slots";
import { insertEvent } from "@/lib/insert-event";
import { getCalendarData } from "@/lib/get-calendar-data";

const client = new OpenAI();

export async function POST(req: NextRequest) {
  const { history, prompt } = await req.json();
  if (!prompt || !history) {
    return new Response(null, {
      status: 400,
      statusText: "Did not include correct parameters",
    });
  }

  const data = await getCalendarData();

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
            },
          },
        },
      }
    ],
  });
  return new Response(JSON.stringify(await runner.finalContent()));
}

async function findOpenSlotsCall(args: {
  duration: number;
  daySpecify: string;
}) {
  const { duration, daySpecify } = args;
  return await findOpenSlots(duration, daySpecify === "" ? null : daySpecify);
}

async function checkConflictCall(args: {
  day: string;
  start: number;
  end: number;
}) {
  const { day, start, end } = args;
  return await checkConflict({
    date: day,
    startTime: start,
    endTime: end,
  });
}

async function findEventsAtTimeCall(args: {
  day: string;
  time: number;
}) {
  const { day, time } = args;
  return await findEventsAtTime(day, time);
}

async function setEventCall(args: {
  date: string;
  startTime: number;
  duration: number;
  description: string;
  name: string;
}) {
  const { date, startTime, duration, description, name } = args;
  return await insertEvent(date, startTime, duration, description, name);
}
