import { NextRequest } from "next/server";
import { OpenAI } from "openai";

import { findOpenSlots, checkConflict } from "@/lib/find-open-slots";

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
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful calendar assistant. You will use tool calls to answer the user's request. If available, list all time slots. Be friendly.",
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
            "Given a duration in minutes, finds all open slots in the user's calendar available for that duration.",
          parameters: {
            type: "object",
            properties: {
              duration: {
                description:
                  "The duration in minutes of the event to be scheduled.",
                type: "integer",
              },
            },
          },
        },
      },
    ],
  });

  //   const completionsStream = await OpenAI("chat", {
  //     model: "gpt-3.5-turbo",
  //     messages: [
  //       {
  //         role: "system",
  //         content: "You are a helpful calendar assistant.",
  //       },
  //       {
  //         role: "user",
  //         content: prompt,
  //       },
  //     ],
  //   });

  //   return new Response(completionsStream);

  return new Response(JSON.stringify(await runner.finalContent()));
}

async function findOpenSlotsCall(args: { duration: number }) {
  const { duration } = args;
  return findOpenSlots(duration);
}
