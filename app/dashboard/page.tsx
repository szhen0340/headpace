"use client";

import ChatBox from "@/components/llm-stream";
import { Input } from "@/components/ui/input";
import { ArrowBigRight, Mic } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import data from "@/data.json";
import Fuse from "fuse.js";

const FormSchema = z.object({
  input: z.string(),
});

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      input: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

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
    <main className="flex min-h-screen max-h-screen max-w-screen">
      <div className="h-screen w-20 sm:w-40 bg-primary"></div>
      <div className="flex flex-col justify-content items-center mt-8 w-full">
        <Input
          className="w-[40vw] mb-2 border-primary border-2"
          type="text"
          placeholder="Search"
          onChange={handleSearch}
        />
        <ScrollArea className="max-h-screen my-2 w-[40vw]">
          <div className="flex flex-col gap-2 p-4 pt-0">
            {searchResults.map((event: CalendarEvent) => (
              <button
                key={event.name}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
                )}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{event.name}</div>
                    </div>
                  </div>
                  <div className="text-xs font-medium">
                    {event.startTime + " - " + event.endTime}
                  </div>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {event.description}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="w-[40vw] pb-4 pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="input"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Ask your AI assistant about your calendar."
                        className="resize-none border-primary border-2 border-b-0 rounded-lg rounded-b-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end w-full border-2 border-primary border-t-0 rounded-lg rounded-t-none p-2 gap-2">
                <Mic size={18} /> <ArrowBigRight size={18} />
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/*
          <ChatBox />
          */}
    </main>
  );
}
