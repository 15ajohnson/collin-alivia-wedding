import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env["DATABASE_URL"]!;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });


async function main() {
    // Clear existing data (ordered to respect FK constraints)
    await prisma.rsvpAttendee.deleteMany();
    await prisma.rsvp.deleteMany();
    await prisma.reservationMember.deleteMany();
    await prisma.reservation.deleteMany();

    await prisma.reservation.createMany({
        data: [
            // Two Smith reservations — tests disambiguation UI
            { id: 1, lastName: "Smith", displayName: "The Smith Family", maxSeats: 4 },
            { id: 2, lastName: "Smith", displayName: "Bob & Alice Smith", maxSeats: 3 },
            // Johnson — already submitted
            { id: 3, lastName: "Johnson", displayName: "The Johnson Family", maxSeats: 2 },
            // Williams
            { id: 4, lastName: "Williams", displayName: "David & Emma Williams", maxSeats: 3 },
        ],
    });

    await prisma.reservationMember.createMany({
        data: [
            // Reservation 1 — The Smith Family
            { id: 1, reservationId: 1, firstName: "John", hasPlusOne: false, rehearsalDinnerInvited: true },
            { id: 2, reservationId: 1, firstName: "Jane", hasPlusOne: false, rehearsalDinnerInvited: false },
            { id: 3, reservationId: 1, firstName: "Emily", hasPlusOne: true, rehearsalDinnerInvited: true },

            // Reservation 2 — Bob & Alice Smith
            { id: 4, reservationId: 2, firstName: "Bob", hasPlusOne: true, rehearsalDinnerInvited: false },
            { id: 5, reservationId: 2, firstName: "Alice", hasPlusOne: false, rehearsalDinnerInvited: false },

            // Reservation 3 — The Johnson Family (already submitted)
            { id: 6, reservationId: 3, firstName: "Michael", hasPlusOne: false, rehearsalDinnerInvited: true },
            { id: 7, reservationId: 3, firstName: "Sarah", hasPlusOne: false, rehearsalDinnerInvited: true },

            // Reservation 4 — David & Emma Williams
            { id: 8, reservationId: 4, firstName: "David", hasPlusOne: true, rehearsalDinnerInvited: false },
            { id: 9, reservationId: 4, firstName: "Emma", hasPlusOne: false, rehearsalDinnerInvited: true },
        ],
    });

    // Seed a pre-existing RSVP for the Johnson family (tests "already submitted" UI)
    const johnsonRsvp = await prisma.rsvp.create({
        data: {
            reservationId: 3,
            submittedAt: new Date("2026-04-01T12:00:00Z"),
        },
    });

    await prisma.rsvpAttendee.createMany({
        data: [
            {
                rsvpId: johnsonRsvp.id,
                reservationMemberId: 6, // Michael
                mealChoice: "Herb-Roasted Chicken",
                rehearsalDinnerAttending: true,
            },
            {
                rsvpId: johnsonRsvp.id,
                reservationMemberId: 7, // Sarah
                mealChoice: "Pan-Seared Salmon",
                rehearsalDinnerAttending: true,
            },
        ],
    });

    console.log("Seed complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
