import { NextRequest } from "next/server";
import { OpenAI } from "openai";

import { findOpenSlots, checkConflict } from "@/lib/find-open-slots";

import data from "@/data.json";

const client = new OpenAI();

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) {
    return new Response(null, {
      status: 400,
      statusText: "Did not include `prompt` parameter",
    });
  }

  const runner = client.beta.chat.completions.runTools({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are a helpful calendar assistant. You will use tool calls to answer the user's request.
If the user wants to know all available time slots, call the findOpenSlots tool.
If the user wants to check for a conflict or whether adding a new event is feasible, call the checkConflict tool.
If available, list all time slots. Be friendly.`,
      },
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
    ],
  });
  return new Response(JSON.stringify(await runner.finalContent()));
}

async function findOpenSlotsCall(args: {
  duration: number;
  daySpecify: string;
}) {
  const { duration, daySpecify } = args;
  return findOpenSlots(duration, daySpecify === "" ? null : daySpecify);
}

async function checkConflictCall(args: {
  day: string;
  start: number;
  end: number;
}) {
  const { day, start, end } = args;
  //console.log(day, start, end);
  return checkConflict({
    date: day,
    startTime: start,
    endTime: end,
  });
}
