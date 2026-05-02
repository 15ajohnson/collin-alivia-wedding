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
                rehearsalDinnerInvited: true,
            },
            // Couple, no plus-one
            {
                id: 2,
                lastName: "Williams",
                displayName: "The Williams Family",
                maxSeats: 4,
                rehearsalDinnerInvited: false,
            },
            // Couple with plus-one slot
            {
                id: 3,
                lastName: "Martinez",
                displayName: "David & Sarah Martinez",
                maxSeats: 3,
                rehearsalDinnerInvited: false,
            },
            // Family, rehearsal dinner invited
            {
                id: 4,
                lastName: "Thompson",
                displayName: "The Thompson Family",
                maxSeats: 5,
                rehearsalDinnerInvited: true,
            },
            // Single guest with plus-one slot
            {
                id: 5,
                lastName: "Chen",
                displayName: "Emily Chen",
                maxSeats: 2,
                rehearsalDinnerInvited: false,
            },
            // Two reservations with the same last name (tests disambiguation UI)
            {
                id: 6,
                lastName: "Smith",
                displayName: "Robert & Karen Smith",
                maxSeats: 2,
                rehearsalDinnerInvited: false,
            },
            {
                id: 7,
                lastName: "Smith",
                displayName: "James & Patricia Smith",
                maxSeats: 2,
                rehearsalDinnerInvited: true,
            },
        ],
    });

    await prisma.reservationMember.createMany({
        data: [
            // Reservation 1 — Michael Johnson (solo)
            { reservationId: 1, firstName: "Michael" },

            // Reservation 2 — Williams Family
            { reservationId: 2, firstName: "Daniel" },
            { reservationId: 2, firstName: "Laura" },
            { reservationId: 2, firstName: "Olivia" },
            { reservationId: 2, firstName: "Noah" },

            // Reservation 3 — David & Sarah Martinez (+ plus-one slot, not seeded)
            { reservationId: 3, firstName: "David" },
            { reservationId: 3, firstName: "Sarah" },

            // Reservation 4 — Thompson Family
            { reservationId: 4, firstName: "Brian" },
            { reservationId: 4, firstName: "Susan" },
            { reservationId: 4, firstName: "Tyler" },
            { reservationId: 4, firstName: "Megan" },
            { reservationId: 4, firstName: "Grace" },

            // Reservation 5 — Emily Chen (+ plus-one slot, not seeded)
            { reservationId: 5, firstName: "Emily" },

            // Reservation 6 — Robert & Karen Smith
            { reservationId: 6, firstName: "Robert" },
            { reservationId: 6, firstName: "Karen" },

            // Reservation 7 — James & Patricia Smith
            { reservationId: 7, firstName: "James" },
            { reservationId: 7, firstName: "Patricia" },
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
