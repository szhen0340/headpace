"use server";

import { getCalendarData } from "@/lib/get-calendar-data";
import { findOpenSlots } from "./find-open-slots";

function minutesToMilitary(minutes: number) {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    return hours * 100 + mins;
}

function militaryToMinutes(military: number) {
    let hours = Math.floor(military / 100);
    let mins = military % 100;
    return hours * 60 + mins;
}

// duration: minutes
export async function findMultipleOpenSlots(duration: number, daySpecify: string) {
    const data1 = await findOpenSlots(duration, daySpecify, "calendar1");
    const data2 = await findOpenSlots(duration, daySpecify, "calendar2");

    let i = 0;
    let j = 0;


    let openTimes: TimeSlot[] = [];
    while (i < data1.length && j < data2.length) {
        if (data1[i].startTime >= data2[j].endTime) {
            j += 1;
        } else if (data2[j].startTime >= data1[i].endTime) {
            i += 1;
        } else {
            openTimes.push({
                date: daySpecify as string,
                startTime: Math.max(data1[i].startTime, data2[j].startTime),
                endTime: Math.min(data1[i].endTime, data2[j].endTime)
            });

            if (data1[i].endTime > data2[j].endTime) {
                j += 1;
            } else if (data2[j].endTime > data1[i].endTime) {
                i += 1;
            } else {
                i += 1;
                j += 1;
            }
        }
    }

    return openTimes;
};
