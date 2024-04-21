import { NextRequest } from "next/server";
import { OpenAI } from "openai";

const client = (process.env.NO_AI?.toString().trim() != "true") ? new OpenAI() : undefined as unknown as OpenAI;

export async function POST(req: NextRequest) {
    const { text } = await req.json();
    if (!text) {
        return new Response(null, {
            status: 400,
            statusText: "Did not include `text` parameter",
        });
    }

    if (process.env.NO_AI?.toString().trim() == "true") {
        // reject with boilerplate message
        return new Response(
            JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: "Sorry, the AI feature is disabled. Please deploy locally to use the AI feature with your own API Keys.",
                    },
                ],
            }),
        );
    }

    const runner = client.audio.speech.create({
        model: "tts-1",
        input: text,
        voice: "alloy",
    });
    return new Response((await runner).body);
}