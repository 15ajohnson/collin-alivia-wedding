"use server"

import { getToken } from "@/lib/auth";

export async function rsvp(rsvp: FormData) {
    console.log("RSVP received:", rsvp);

    const accessToken = await getToken();
    console.log("Access token:", accessToken);
}
