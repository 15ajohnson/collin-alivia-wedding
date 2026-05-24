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

export async function submitRsvp(
  reservationId: number,
  attendees: {
    memberId: number;
    mealChoice: MealChoice;
    rehearsalDinnerAttending: boolean;
    plusOneMealChoice?: MealChoice;
  }[],
): Promise<SubmitRsvpResult> {
  try {
    // Create the RSVP record
    const rsvp = await prisma.rsvp.create({
      data: {
        reservationId,
        submittedAt: new Date(),
      },
    });

    // Create RSVP attendee records
    const rsvpAttendeesData = attendees.map((a) => ({
      rsvpId: rsvp.id,
      reservationMemberId: a.memberId,
      mealChoice: a.mealChoice,
      rehearsalDinnerAttending: a.rehearsalDinnerAttending,
      plusOneMealChoice: a.plusOneMealChoice,
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
