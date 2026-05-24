
import * as prisma from "../../../generated/prisma/client";

export type Reservation = prisma.Reservation;

export type ReservationWithMembers = Reservation & {
    members: prisma.ReservationMember[];
};

export type ReservationWithMembersWithRsvp = ReservationWithMembers & {
    rsvp: prisma.Rsvp | null;
};