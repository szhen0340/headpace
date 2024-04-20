"use client";

import Image from "next/image";

import ChatBox from "@/components/llm-stream";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowBigRight, Mic } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import data from "@/data.json";

export default function Home() {
  let eventsList: CalendarEvent[] = [];
  data.forEach((day: Day) => {
    eventsList.push(day.events);
  });
  return (
    <main className="flex min-h-screen">
      <div className="h-screen w-40 bg-black"></div>
      <div className="flex flex-col justify-content items-center w-[40vw] mt-8">
        <Textarea
          placeholder="Ask your AI assistant about your calendar."
          className="resize-none border-black border-2 border-b-0 rounded-lg rounded-b-none"
        />
        <div className="flex justify-end w-full border-2 border-black border-t-0 rounded-lg rounded-t-none p-2 gap-2">
          <Mic size={24} /> <ArrowBigRight size={24} />
        </div>
        <ScrollArea className="h-screen">
          <div className="flex flex-col gap-2 p-4 pt-0">
            {data.map((day) => (
              <button
                key={day.name}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
                )}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{day.name}</div>
                    </div>
                  </div>
                  <div className="text-xs font-medium">{day.name}</div>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {day.name}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
      {/*
          <ChatBox />
          */}
    </main>
  );
}
