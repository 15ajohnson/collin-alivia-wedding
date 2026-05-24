"use server";

import { prisma } from "@/lib/prisma";
import { ReservationWithMembersWithRsvp } from "../rsvp/rsvp.types";

export interface ReservationLookupResult {
    reservations?: { reservation: ReservationWithMembersWithRsvp; alreadySubmitted: boolean }[];
    error?: string;
}

export async function lookupReservations(lastName: string): Promise<ReservationLookupResult> {

    if (!lastName) {
        return { error: "Last name is required" };
    }

    return prisma.reservation.findMany({
        where: {
            lastName: {
                contains: lastName, // COLLATE NOCASE in the database ensures this is case-insensitive
            }
        },
        include: {
            members: true,
            rsvp: true,
        },
    }).then(reservations => {
        const reservationsWithStatus = reservations.map(r => ({
            reservation: r,
            alreadySubmitted: !!r.rsvp,
        }));
        return { reservations: reservationsWithStatus };
    }).catch(error => {
        console.error("Error looking up reservations:", error);
        return { error: "Internal server error" };
    });
}