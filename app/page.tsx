"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, ArrowBigRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Form } from "react-hook-form";
import Typewriter from "typewriter-effect";

export default function IndexPage() {
    return (
        <main className="w-screen h-screen p-8">
            <div className="flex p-8 ml-24">
                <Image src="/" alt="" width={40} height={40} />
                <span>Logoipsum</span>
            </div>
            <div className="flex">
                <div className="flex max-w-[700px] flex-col items-start gap-2 p-8 ml-24 mt-16">
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl">
                        Headpace, AI-Powered Calendar Assistant
                    </h1>
                    <p className="max-w-[500px] text-lg text-muted-foreground">
                        Transform your productivity.
                        Designed to streamline your schedule, manage appointments, and keep you on track.
                        Experience the future of time management today.
                    </p>
                    <div className="flex gap-4 text-lg font-bold">
                        <Button className="h-12 w-36">
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button className="h-12 w-36" variant="outline">Learn more</Button>
                    </div>
                </div>
                <div className="h-[70vh] w-[40vw] bg-primary flex flex-col items-center justify-center rounded-lg">
                    <div className="w-[30vw] pb-4 pt-2">
                        <ScrollArea id="chat" className="w-[30vw] h-[50vh] bg-white rounded-lg my-4 p-4">
                            <div className="text-sm flex items-center gap-2 my-4">
                                <Avatar>
                                    <AvatarImage src="https://github.com/szhen0340.png" alt="User" />
                                    <AvatarFallback>User</AvatarFallback>
                                </Avatar>
                                <span>Hey Headspace, what times will both my client and I free tomorrow for 15 minutes?</span>
                            </div>
                            <div className="text-sm flex items-center gap-2 my-4 justify-end">
                                <Typewriter
                                    options={{
                                        delay: 10,
                                        autoStart: true,
                                        loop: true,
                                    }}
                                    onInit={(typewriter) => {
                                        typewriter.typeString(
                                            `Tomorrow, you and your client are both free during the following time slots for at least 15 minutes:
                                            from 12:30 PM to 2:00 PM and from 5:30 PM to 6:00 PM\nFeel free to pick any of these slots for planning your event!`)
                                            .start();
                                    }}
                                />
                                <Avatar>
                                    <AvatarImage src="https://github.com/szhen0340.png" alt="User" />
                                    <AvatarFallback>User</AvatarFallback>
                                </Avatar>
                            </div>
                        </ScrollArea>
                        <div className="flex justify-end w-full rounded-lg rounded-t-none p-2 gap-2 bg-white">
                            <Button variant="ghost" className="size-6 p-0 m-0" disabled>
                                <Mic size={18} />
                            </Button>
                            <Button type="submit" variant="ghost" className="size-6 p-0 m-0" disabled>
                                <ArrowBigRight size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    );
}