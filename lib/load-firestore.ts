"use server";

import { dbAdmin } from "@/lib/firebase-admin";
import data from "@/data.json";

export async function loadFirebase() {
    let dayCollection: any[] = [];

    data.forEach((day) => {
        dayCollection.push({
            "name": day.name,
            "events": day.events,
        });
    });

    dbAdmin.collection("calendars").doc("calendar1").set({
        days: dayCollection,
    });
}
