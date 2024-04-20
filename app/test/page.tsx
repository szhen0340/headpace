"use client";

import Image from "next/image";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowBigRight, Mic } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { useState, FormEvent } from "react";

import data from "@/data.json";
import Fuse from "fuse.js";

export default function Home() {
  let eventsList: CalendarEvent[] = [];
  data.forEach((day: Day) => {
    day.events.forEach((event: CalendarEvent) => {
      let newEvent = {
        name: event.name + " -=- " + day.name,
        startTime: event.startTime,
        endTime: event.endTime,
        description: event.description,
      };

      eventsList.push(newEvent);
    });
  });

  const [searchResults, setSearchResults] = useState(eventsList);
  const options = {
    includeMatches: true,
    ignoreLocation: true,
    threshold: 0.0,
    findAllMatches: true,
    keys: ["name", "startTime", "endTime", "description"],
  };
  const fuse = new Fuse(eventsList, options);

  const handleSearch = (event: any) => {
    const { value } = event.target;

    if (value.length === 0) {
      setSearchResults(eventsList);
      return;
    }

    const results = fuse.search(value);
    const items = results.map((result) => result.item);
    setSearchResults(items);
  };

  return (
    <main className="flex min-h-screen max-h-screen w-screen">
      <div className="h-screen w-20 sm:w-40 bg-black"></div>
      <div className="w-full flex">
        <div className="flex flex-col justify-content items-center w-[40vw] mt-8">
          <Input type="text" placeholder="Search" onChange={handleSearch} />
          <ScrollArea className="max-h-screen my-2">
            <div className="flex flex-col gap-2 p-4 pt-0">
              {searchResults.map((event: CalendarEvent) => (
                <button
                  key={event.name.split("-=-")[0]}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
                  )}
                >
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">
                          {event.name.split("-=-")[0]}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-medium">
                      {event.name.split("-=-")[1] +
                        ": " +
                        event.startTime +
                        " - " +
                        event.endTime}
                    </div>
                  </div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">
                    {event.description}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
          <Textarea
            name="prompt"
            placeholder="Ask your AI assistant about your calendar."
            className="resize-none border-black border-2 border-b-0 rounded-lg rounded-b-none"
            id="assistant-input"
          />
          <div className="flex justify-end w-full border-2 border-black border-t-0 rounded-lg rounded-t-none p-2 gap-2">
            <Mic size={20} />{" "}
            <ArrowBigRight onClick={onAssistantSubmit} size={20} />
          </div>
        </div>
      </div>
    </main>
  );
}

async function onAssistantSubmit() {
  // const prompt = document.getElementById("assistant-input") a
  // const res = await fetch("/api/llm", {
  //   method: form.method,
  //   body: formData,
  // });
  // console.log(res);
}
