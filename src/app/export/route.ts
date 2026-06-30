import { prisma } from "@/lib/prisma";

type CsvRow = {
  first_name: string;
  last_name: string;
  rsvp_submitted_at: string;
  meal_choice: string;
  dietary_restrictions: string;
  rehearsal_dinner_attending: string;
  has_plus_one_invite: string;
  row_type: "submitted_member" | "submitted_plus_one" | "invited_not_rsvpd";
};

function toCsvValue(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

function toCsv(rows: CsvRow[]): string {
  const headers: (keyof CsvRow)[] = [
    "first_name",
    "last_name",
    "rsvp_submitted_at",
    "meal_choice",
    "dietary_restrictions",
    "rehearsal_dinner_attending",
    "has_plus_one_invite",
    "row_type",
  ];

  const lines = [headers.join(",")];

  for (const row of rows) {
    lines.push(headers.map((header) => toCsvValue(row[header])).join(","));
  }

  return `${lines.join("\n")}\n`;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { firstName: "", lastName: "" };
  }

  const lastSpaceIndex = trimmed.lastIndexOf(" ");
  if (lastSpaceIndex === -1) {
    return { firstName: trimmed, lastName: "" };
  }

  return {
    firstName: trimmed.slice(0, lastSpaceIndex).trim(),
    lastName: trimmed.slice(lastSpaceIndex + 1).trim(),
  };
}

export async function GET(): Promise<Response> {
  const reservations = await prisma.reservation.findMany({
    include: {
      members: true,
      rsvp: {
        include: {
          attendees: {
            include: {
              reservationMember: true,
            },
          },
        },
      },
    },
    orderBy: [{ lastName: "asc" }, { id: "asc" }],
  });

  const rows: CsvRow[] = [];

  for (const reservation of reservations) {
    if (!reservation.rsvp) {
      for (const member of reservation.members) {
        rows.push({
          first_name: member.firstName,
          last_name: reservation.lastName,
          rsvp_submitted_at: "",
          meal_choice: "",
          dietary_restrictions: "",
          rehearsal_dinner_attending: "",
          has_plus_one_invite: member.hasPlusOne ? "yes" : "no",
          row_type: "invited_not_rsvpd",
        });
      }

      continue;
    }

    for (const attendee of reservation.rsvp.attendees) {
      if (attendee.reservationMember) {
        rows.push({
          first_name: attendee.reservationMember.firstName,
          last_name: reservation.lastName,
          rsvp_submitted_at: reservation.rsvp.submittedAt.toISOString(),
          meal_choice: attendee.mealChoice,
          dietary_restrictions: attendee.dietaryRestrictions ?? "",
          rehearsal_dinner_attending:
            attendee.rehearsalDinnerAttending == null
              ? ""
              : attendee.rehearsalDinnerAttending
                ? "yes"
                : "no",
          has_plus_one_invite: attendee.reservationMember.hasPlusOne
            ? "yes"
            : "no",
          row_type: "submitted_member",
        });

        continue;
      }

      const parsedPlusOneName = splitName(attendee.plusOneName ?? "");
      rows.push({
        first_name: parsedPlusOneName.firstName,
        last_name: parsedPlusOneName.lastName,
        rsvp_submitted_at: reservation.rsvp.submittedAt.toISOString(),
        meal_choice: attendee.mealChoice,
        dietary_restrictions: attendee.dietaryRestrictions ?? "",
        rehearsal_dinner_attending: "no",
        has_plus_one_invite: "",
        row_type: "submitted_plus_one",
      });
    }
  }

  const csv = toCsv(rows);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `rsvp-export-${timestamp}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=\"${filename}\"`,
      "Cache-Control": "no-store",
    },
  });
}
