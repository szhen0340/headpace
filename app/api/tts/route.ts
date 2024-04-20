import { NextRequest } from "next/server";
import { OpenAI } from "openai";

const client = new OpenAI();

export async function POST(req: NextRequest) {
    const { text } = await req.json();
    if (!text) {
        return new Response(null, {
            status: 400,
            statusText: "Did not include `text` parameter",
        });
    }

    const runner = client.audio.speech.create({
        model: "tts-1",
        input: text,
        voice: "alloy",
    });
    return new Response((await runner).body);
}