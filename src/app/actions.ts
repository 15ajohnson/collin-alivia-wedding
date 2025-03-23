"use server"

import { addRsvp, parseRsvp } from "@/lib/rsvp";

export async function rsvp(rsvp: FormData) {
    console.log("RSVP received:", rsvp);

    try {
        addRsvp(parseRsvp(rsvp));
    } catch (error) {
        console.error("Error adding RSVP:", error);
    }
}
