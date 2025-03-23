import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS!,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

interface RSVP {
    submitter: string;
    name: string;
    attending: boolean;
}

export function parseRsvp(rsvp: FormData): RSVP {
    return {
        submitter: rsvp.get('name') as string,
        name: rsvp.get('name') as string,
        attending: rsvp.get('attending') === 'on',
    };
}

export async function addRsvp(rsvp: RSVP) {
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.SHEET_ID!;
    const range = "Sheet1!A:C"; // TODO: define sheet structure then update this
    const valueInputOption = "USER_ENTERED";

    const resource = {
        values: [[rsvp.submitter, rsvp.name, rsvp.attending]]
    };

    return await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption,
        requestBody: resource,
    });
}

