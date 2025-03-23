import { addRsvp, parseRsvp } from "@/lib/rsvp";
import { google, sheets_v4 } from "googleapis";
import { describe, expect, test, vi, afterEach } from "vitest";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("parseRsvp", () => {
    test("should parse RSVP form data correctly", () => {
        const formData = new FormData();
        formData.append("name", "John Doe");
        formData.append("attending", "on");

        const rsvp = parseRsvp(formData);

        expect(rsvp).toEqual({
            submitter: "John Doe",
            name: "John Doe",
            attending: true
        });
    });

    test("should handle non-attendees", () => {
        const formData = new FormData();
        formData.append("name", "Jane Doe");

        const rsvp = parseRsvp(formData);

        expect(rsvp).toEqual({
            submitter: "Jane Doe",
            name: "Jane Doe",
            attending: false
        });
    });
});

describe("addRsvp", () => {
    test("should call google sheets append with the correct parameters", async () => {
        process.env.SHEET_ID = "test-spreadsheet-id";
        const fakeRsvp = {
            submitter: "John Doe",
            name: "John Doe",
            attending: true,
        };

        const appendMock = vi.fn().mockResolvedValue({ data: {} });
        const sheetsSpy = vi.spyOn(google, "sheets").mockImplementation(() => ({
            spreadsheets: {
                values: {
                    append: appendMock,
                } as unknown as sheets_v4.Resource$Spreadsheets$Values
            } as unknown as sheets_v4.Resource$Spreadsheets,
        } as unknown as sheets_v4.Sheets));

        await addRsvp(fakeRsvp);

        expect(appendMock).toHaveBeenCalledWith({
            spreadsheetId: process.env.SHEET_ID,
            range: "Sheet1!A:C",
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [[fakeRsvp.submitter, fakeRsvp.name, fakeRsvp.attending]] },
        });

        sheetsSpy.mockRestore();
    });
});
