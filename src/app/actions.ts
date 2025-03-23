"use server"

import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS!,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function rsvp(rsvp: FormData) {
    console.log("RSVP received:", rsvp);

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.SHEET_ID!;
    const range = "Sheet1!A:B";
    const valueInputOption = "USER_ENTERED";

    const resource = {
        values: [[rsvp.get('name'), rsvp.get('plus-one')]]
    };

    try {
        const result = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            requestBody: resource,
        });
        console.log("Row added:", result.data.updates?.updatedRange);
    } catch (error) {
        console.error("Error adding row:", error);
    }
}
