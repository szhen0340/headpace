"use server";

import { dbClient } from "@/lib/firebase-client";
import { doc, getDoc } from "firebase/firestore";

export async function getCalendarData(calendar: string) {
    const docRef = doc(dbClient, "calendars", calendar);
    const docSnap = await getDoc(docRef);

    let data = docSnap.data()?.days;
    data.map((day: Day) => {
        day.events.sort((a: CalendarEvent, b: CalendarEvent) => {
            return a.startTime - b.startTime;
        });
    });

    return data;
} 