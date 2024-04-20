"use server";

import { dbClient } from "@/lib/firebase-client";
import { dbAdmin } from "./firebase-admin";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function insertEvent(date: string, startTime: number, duration: number, description: string, name: string) {
    let extraHours = Math.floor(duration / 60);
    let extraMinutes = duration % 60;
    extraHours += +((startTime % 60 + extraMinutes) >= 60);
    extraMinutes = (extraMinutes + startTime % 60) % 60;
    const event = {
        "name": name,
        "startTime": startTime,
        "endTime": startTime + extraHours * 100 + extraMinutes,
        "description": description,
    };

    const docRef = doc(dbClient, "calendars", "calendar1");
    let docData = (await getDoc(docRef)).data();
    if (docData) {
        docData.days.forEach((day: Day) => {
            if (day.name === date) {
                day.events.push(event);
            }
        });
        dbAdmin.collection("calendars").doc("calendar1").set({
            days: docData.days,
        });
        return true;
    }
    return false;
} 