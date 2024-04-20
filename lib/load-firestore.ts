"use server";

import { dbAdmin } from "@/lib/firebase-admin";
import data from "@/data2.json";

export async function loadFirebase() {
    let dayCollection: any[] = [];

    data.forEach((day) => {
        dayCollection.push({
            "name": day.name,
            "events": day.events,
        });
    });

    dbAdmin.collection("calendars").doc("calendar2").set({
        days: dayCollection,
    });
}
