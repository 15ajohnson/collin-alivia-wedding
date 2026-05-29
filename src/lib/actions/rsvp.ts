"use server";

import { prisma } from "@/lib/prisma";
import { ReservationWithMembersWithRsvp } from "../rsvp/rsvp.types";
import { MealChoice } from "../rsvp/meal-choices";

export interface ReservationLookupResult {
  reservations?: {
    reservation: ReservationWithMembersWithRsvp;
    alreadySubmitted: boolean;
  }[];
  error?: string;
}

export async function lookupReservations(
  lastName: string,
): Promise<ReservationLookupResult> {
  if (!lastName) {
    return { error: "Last name is required" };
  }

  return prisma.reservation
    .findMany({
      where: {
        lastName: {
          contains: lastName, // COLLATE NOCASE in the database ensures this is case-insensitive
        },
      },
      include: {
        members: true,
        rsvp: true,
      },
    })
    .then((reservations) => {
      const reservationsWithStatus = reservations.map((r) => ({
        reservation: r,
        alreadySubmitted: !!r.rsvp,
      }));
      return { reservations: reservationsWithStatus };
    })
    .catch((error) => {
      console.error("Error looking up reservations:", error);
      return { error: "Internal server error" };
    });
}

export interface SubmitRsvpResult {
  success: boolean;
  error?: string;
}

export interface SubmitRsvpRequest {
  reservationId: number;
  attendees: {
    who:
      | { memberId: number }
      | { plusOneName: string; broughtByMemberId: number };
    mealChoice: MealChoice;
    dietaryRestrictions?: string;
    rehearsalDinnerAttending: boolean;
  }[];
}

export async function submitRsvp(
  request: SubmitRsvpRequest,
): Promise<SubmitRsvpResult> {
  try {
    // Create the RSVP record
    const rsvp = await prisma.rsvp.create({
      data: {
        reservationId: request.reservationId,
        submittedAt: new Date(),
      },
    });

    type AttendeeWho = SubmitRsvpRequest["attendees"][number]["who"];

    const isPlusOne = (
      who: AttendeeWho,
    ): who is Extract<AttendeeWho, { plusOneName: string }> =>
      "plusOneName" in who;

    // Create named RSVP attendee records
    const rsvpAttendeesData = request.attendees.map((a) => ({
      rsvpId: rsvp.id,
      reservationMemberId: isPlusOne(a.who) ? null : a.who.memberId,
      plusOneName: isPlusOne(a.who) ? a.who.plusOneName : null,
      broughtByMemberId: isPlusOne(a.who) ? a.who.broughtByMemberId : null,
      dietaryRestrictions: a.dietaryRestrictions,
      mealChoice: a.mealChoice,
      rehearsalDinnerAttending: a.rehearsalDinnerAttending,
    }));

    await prisma.rsvpAttendee.createMany({
      data: rsvpAttendeesData,
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    return {
      success: false,
      error: "Failed to submit RSVP. Please try again later.",
    };
  }
}
