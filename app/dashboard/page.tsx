"use client";

import { Input } from "@/components/ui/input";
import { ArrowBigRight, Mic } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";

import Fuse from "fuse.js";
import Typewriter from "typewriter-effect";
import { loadFirebase } from "@/lib/load-firestore";
import { getCalendarData } from "@/lib/get-calendar-data";
import { insertEvent } from "@/lib/insert-event";
import { doc, onSnapshot } from "firebase/firestore";
import { dbClient } from "@/lib/firebase-client";

import { findMultipleOpenSlots } from "@/lib/find-multiple-open-slots";

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

  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);

  useEffect(() => {}, [chatHistory]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const prompt = data.input;
    if (prompt.trim().length === 0) {
      return;
    }
    form.reset();

    chatHistory.push({
      role: "user",
      content: data.input,
    });
    //console.log(prompt);
    const res = await fetch("/api/llm", {
      method: "POST",
      body: JSON.stringify({
        history: chatHistory,
        prompt: prompt,
      }),
    });
    const text = (await res.json()).toString();
    chatHistory.push({
      role: "assistant",
      content: text,
    });

    // toast({
    //   title: "Assistant Response:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{text}</code>
    //     </pre>
    //   ),
    // });

    const audioRes = await fetch("/api/tts", {
      method: "POST",
      body: JSON.stringify({
        text: text.toString(),
      }),
    });

    const buffer = Buffer.from(await audioRes.arrayBuffer());
    const blob = new Blob([buffer], { type: "audio/mp3" });
    const audioURL = URL.createObjectURL(blob);
    const audio = new Audio(audioURL);
    audio.play();
  }

  const eventsListRef = useRef<CalendarEvent[]>([]);

  //const [data, setData] = useState<any>([{}]);
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const getData = async () => {
      console.log(await findMultipleOpenSlots(30, "04/21/2024"));
      const calendarData = await getCalendarData("calendar2");
      calendarData.forEach((day: Day) => {
        day.events.forEach((event: CalendarEvent) => {
          let newEvent = {
            name: event.name + " -=- " + day.name,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
          };

          eventsListRef.current.push(newEvent);
        });
      });
    };

    getData();

    return () => clearInterval(interval);
  }, []);

  if (false) {
    onSnapshot(doc(dbClient, "calendars", "calendar1"), (snapshot) => {
      // update eventsListRef
      eventsListRef.current = [];
      snapshot.data()?.days.forEach((day: Day) => {
        day.events.forEach((event: CalendarEvent) => {
          let newEvent = {
            name: event.name + " -=- " + day.name,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
          };

          eventsListRef.current.push(newEvent);
        });
      });
    });
  }

  useEffect(() => {
    setSearchResults(eventsListRef.current);
  }, []);

  const [searchResults, setSearchResults] = useState(eventsListRef.current);
  const options = {
    includeMatches: true,
    ignoreLocation: true,
    threshold: 0.0,
    findAllMatches: true,
    keys: ["name", "startTime", "endTime", "description"],
  };
  const fuse = new Fuse(eventsListRef.current, options);

  const handleSearch = (event: any) => {
    const { value } = event.target;

    if (value.length === 0) {
      setSearchResults(eventsListRef.current);
      return;
    }

    const results = fuse.search(value);
    const items = results.map((result) => result.item);
    setSearchResults(items);
  };

  const newTime = (dateObject: Date, time: number, day: string) => {
    let dateObj = new Date(dateObject);

    dateObj.setMinutes(time % 100);
    dateObj.setHours(Math.floor(time / 100));
    dateObj.setMonth(parseInt(day.split("/")[0]) - 1);
    dateObj.setDate(parseInt(day.split("/")[1]));

    return dateObj;
  };

  const formatCountdownString = (timeDiff: number) => {
    const seconds = timeDiff / 1000;
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}D ${hours}H ${minutes}M`;
  };

  const militaryTo12 = (time: number) => {
    let string = "";
    if (time % 100 < 10) {
      string = `${
        Math.floor(time / 100) - 12 * +(Math.floor(time / 100) > 12)
      }:0${time % 100}`;
    } else {
      string = `${
        Math.floor(time / 100) - 12 * +(Math.floor(time / 100) > 12)
      }:${time % 100}`;
    }

    if (Math.floor(time / 100) >= 12) {
      string += " PM";
    } else {
      string += " AM";
    }

    return string;
  };

  return (
    <main className="flex min-h-screen max-h-screen max-w-screen">
      <div className="h-screen w-[50vw] bg-primary flex flex-col items-center">
        <div className="w-[30vw] pb-4 pt-2">
          <ScrollArea
            id="chat"
            className="w-[30vw] h-[80vh] bg-white rounded-lg my-4 p-4"
          >
            {chatHistory.map((datapoint, index) => {
              const { role, content } = datapoint;
              return (
                <div key={index}>
                  {role === "user" ? (
                    <div className="text-sm flex items-center gap-2 my-4">
                      <Avatar>
                        <AvatarImage
                          src="https://github.com/szhen0340.png"
                          alt="User"
                        />
                        <AvatarFallback>User</AvatarFallback>
                      </Avatar>
                      <span>{content}</span>
                    </div>
                  ) : (
                    <div className="text-sm flex items-center gap-2 my-4">
                      <Typewriter
                        options={{
                          delay: 10,
                        }}
                        onInit={(typewriter) => {
                          typewriter
                            .typeString(
                              content
                                .replaceAll("\n", "<br/>")
                                .replaceAll("  ", "&nbsp;&nbsp;")
                                // regex for **...**
                                .replaceAll(
                                  /\*\*(.*?)\*\*/g,
                                  "<strong>$1</strong>"
                                )
                                // regex for *...*
                                .replaceAll(/\*(.*?)\*/g, "<em>$1</em>")
                            )
                            .start();
                        }}
                      />
                      <Avatar>
                        <AvatarImage src="/" alt="AI" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              );
            })}
          </ScrollArea>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="input"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Ask your AI assistant about your calendar."
                        className="resize-none bg-white rounded-lg rounded-b-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end w-full rounded-lg rounded-t-none p-2 gap-2 bg-white">
                <Button variant="ghost" className="size-6 p-0 m-0">
                  <Mic size={18} />
                </Button>
                <Button
                  type="submit"
                  variant="ghost"
                  className="size-6 p-0 m-0"
                >
                  <ArrowBigRight size={18} />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="flex flex-col justify-content items-center mt-8 w-full">
        <Input
          className="w-[40vw] mb-2 border-primary border-2"
          type="text"
          placeholder="Search"
          onChange={handleSearch}
        />
        <ScrollArea className="max-h-screen my-2 w-[40vw]">
          <div className="flex flex-col gap-2 p-4 pt-0">
            {searchResults.map((event: CalendarEvent, index) => {
              let currentTime = time.getTime();
              let eventDay = event.name.split("-=-")[1];
              // parse eventDay from mm/dd/yyyy to Date object
              const eventDateObj = new Date();
              eventDateObj.setFullYear(parseInt(eventDay.split("/")[2]));
              eventDateObj.setMonth(parseInt(eventDay.split("/")[0]) - 1);
              eventDateObj.setDate(parseInt(eventDay.split("/")[1]));
              // get day diff from today
              const dayDiff = Math.floor(
                (eventDateObj.getTime() - currentTime) / (1000 * 3600 * 24)
              );
              let nextTime = newTime(time, event.startTime, eventDay);
              let countdownString = formatCountdownString(
                nextTime.getTime() - currentTime
              );
              return (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent" +
                      (dayDiff % 2 == 0 ? " bg-slate-100" : "")
                  )}
                >
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex justify-between font-semibold">
                      <span>{event.name.split("-=-")[0]}</span>
                      <span>{countdownString}</span>
                    </div>
                    <div className="text-xs font-medium">
                      {event.name.split("-=-")[1] +
                        ": " +
                        militaryTo12(event.startTime) +
                        " - " +
                        militaryTo12(event.endTime)}
                    </div>
                  </div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">
                    {event.description}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}
