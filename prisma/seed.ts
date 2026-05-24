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
            // Single guest, no plus-one, rehearsal dinner invited
            {
                id: 1,
                lastName: "Johnson",
                displayName: "Michael Johnson",
                maxSeats: 1,
            },
            // Couple, no plus-one
            {
                id: 2,
                lastName: "Williams",
                displayName: "The Williams Family",
                maxSeats: 4,
            },
            // Couple with plus-one slot
            {
                id: 3,
                lastName: "Martinez",
                displayName: "David & Sarah Martinez",
                maxSeats: 3,
            },
            // Family, rehearsal dinner invited
            {
                id: 4,
                lastName: "Thompson",
                displayName: "The Thompson Family",
                maxSeats: 5,
            },
            // Single guest with plus-one slot
            {
                id: 5,
                lastName: "Chen",
                displayName: "Emily Chen",
                maxSeats: 2,
            },
            // Two reservations with the same last name (tests disambiguation UI)
            {
                id: 6,
                lastName: "Smith",
                displayName: "Robert & Karen Smith",
                maxSeats: 2,
            },
            {
                id: 7,
                lastName: "Smith",
                displayName: "James & Patricia Smith",
                maxSeats: 2,
            },
        ],
    });

    await prisma.reservationMember.createMany({
        data: [
            // Reservation 1 — Michael Johnson (solo)
            { reservationId: 1, firstName: "Michael", hasPlusOne: false, rehearsalDinnerInvited: true },

            // Reservation 2 — Williams Family
            { reservationId: 2, firstName: "Daniel", hasPlusOne: false, rehearsalDinnerInvited: false },
            { reservationId: 2, firstName: "Laura", hasPlusOne: false, rehearsalDinnerInvited: false },
            { reservationId: 2, firstName: "Olivia", hasPlusOne: false, rehearsalDinnerInvited: false },
            { reservationId: 2, firstName: "Noah", hasPlusOne: false, rehearsalDinnerInvited: false },

            // Reservation 3 — David & Sarah Martinez (+ plus-one slot, not seeded)
            { reservationId: 3, firstName: "David", hasPlusOne: true, rehearsalDinnerInvited: false },
            { reservationId: 3, firstName: "Sarah", hasPlusOne: false, rehearsalDinnerInvited: true },

            // Reservation 4 — Thompson Family
            { reservationId: 4, firstName: "Brian", hasPlusOne: false, rehearsalDinnerInvited: true },
            { reservationId: 4, firstName: "Susan", hasPlusOne: false, rehearsalDinnerInvited: true },
            { reservationId: 4, firstName: "Tyler", hasPlusOne: false, rehearsalDinnerInvited: false },
            { reservationId: 4, firstName: "Megan", hasPlusOne: false, rehearsalDinnerInvited: false },
            { reservationId: 4, firstName: "Grace", hasPlusOne: false, rehearsalDinnerInvited: false },

            // Reservation 5 — Emily Chen (+ plus-one slot, not seeded)
            { reservationId: 5, firstName: "Emily", hasPlusOne: true, rehearsalDinnerInvited: false },

            // Reservation 6 — Robert & Karen Smith
            { reservationId: 6, firstName: "Robert", hasPlusOne: false, rehearsalDinnerInvited: false },
            { reservationId: 6, firstName: "Karen", hasPlusOne: false, rehearsalDinnerInvited: false },

            // Reservation 7 — James & Patricia Smith
            { reservationId: 7, firstName: "James", hasPlusOne: false, rehearsalDinnerInvited: true },
            { reservationId: 7, firstName: "Patricia", hasPlusOne: false, rehearsalDinnerInvited: true },
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
