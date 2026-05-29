"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  lookupReservations,
  ReservationLookupResult,
  submitRsvp,
} from "@/lib/actions/rsvp";
import { ReservationWithMembersWithRsvp } from "@/lib/rsvp/rsvp.types";
import React from "react";
import { MEAL_CHOICES, MealChoice } from "@/lib/rsvp/meal-choices";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Eater {
  name: string;
  mealChoice: MealChoice;
  dietaryRestrictions: string;
}

type AttendeeState = Eater & {
  memberId: number;
  plusOneAvailable: boolean;
  rehearsalDinnerInvited: boolean;
  rehearsalDinnerAttending: boolean;
  attending: boolean;
  plusOneSelected: boolean;
  plusOne: Eater;
};

type Step =
  | "lookup"
  | "disambiguate"
  | "details"
  | "confirmation"
  | "already-submitted"
  | "no-results";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildAttendeeState(
  reservation: ReservationWithMembersWithRsvp,
): AttendeeState[] {
  return reservation.members.map((m) => ({
    memberId: m.id,
    name: m.firstName,
    plusOneAvailable: m.hasPlusOne,
    rehearsalDinnerInvited: m.rehearsalDinnerInvited,
    rehearsalDinnerAttending: false,
    attending: false,
    mealChoice: "",
    dietaryRestrictions: "",
    plusOneSelected: false,
    plusOne: { name: "", mealChoice: "", dietaryRestrictions: "" },
  }));
}

function submit(
  selectedReservation: ReservationWithMembersWithRsvp,
  attendees: AttendeeState[],
) {
  const submissionAttendees = attendees.map((a) => ({
    memberId: a.memberId,
    mealChoice: a.mealChoice,
    rehearsalDinnerAttending: a.rehearsalDinnerAttending,
    plusOneMealChoice:
      a.plusOneSelected && a.plusOne.mealChoice
        ? a.plusOne.mealChoice
        : undefined,
  }));
  return submitRsvp(selectedReservation!.id, submissionAttendees);
}

// ---------------------------------------------------------------------------
// Sub-views
// ---------------------------------------------------------------------------

function LookupStep({
  onFound,
  onAlreadySubmitted,
  onNoResults,
  onDisambiguate,
}: {
  onFound: (reservation: ReservationWithMembersWithRsvp) => void;
  onAlreadySubmitted: () => void;
  onNoResults: () => void;
  onDisambiguate: (reservations: ReservationLookupResult) => void;
}) {
  const [lastName, setLastName] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLookupError(null);
    const results = await lookupReservations(lastName);

    if (results.error || !results.reservations) {
      setLookupError(
        "Something went wrong looking up your reservation. Please try again.",
      );
      return;
    }

    if (results.reservations.length === 0) {
      onNoResults();
      return;
    }

    if (results.reservations.length === 1) {
      if (results.reservations[0].alreadySubmitted) {
        onAlreadySubmitted();
      } else {
        onFound(results.reservations[0].reservation);
      }
      return;
    }

    onDisambiguate(results);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Enter your last name to find your reservation.
      </p>
      {lookupError && <p className="text-sm text-destructive">{lookupError}</p>}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="last-name">Last name</Label>
        <Input
          id="last-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="e.g. Smith"
          autoComplete="family-name"
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit" className="w-full">
          Find my reservation
        </Button>
      </DialogFooter>
    </form>
  );
}

function DisambiguateStep({
  reservationLookupResults,
  onSelect,
}: {
  reservationLookupResults: ReservationLookupResult;
  onSelect: (
    reservation: ReservationWithMembersWithRsvp,
    alreadySubmitted: boolean,
  ) => void;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  function handleContinue() {
    const reservation = reservationLookupResults.reservations?.find(
      (r) => r.reservation.id === selectedId,
    );
    if (!reservation) return;
    onSelect(reservation.reservation, reservation.alreadySubmitted);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Multiple reservations found. Please select yours.
      </p>
      <RadioGroup
        value={selectedId?.toString() ?? ""}
        onValueChange={(val) => setSelectedId(Number(val))}
        className="flex flex-col gap-2"
      >
        {reservationLookupResults.reservations?.map((r) => (
          <div key={r.reservation.id} className="flex items-center gap-2">
            <RadioGroupItem
              value={r.reservation.id.toString()}
              id={`reservation-${r.reservation.id}`}
            />
            <Label htmlFor={`reservation-${r.reservation.id}`}>
              {r.reservation.displayName}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <DialogFooter>
        <Button
          onClick={handleContinue}
          disabled={selectedId === null}
          className="w-full"
        >
          Continue
        </Button>
      </DialogFooter>
    </div>
  );
}

function MealSelection({
  eater,
  onChange,
}: {
  eater: Eater;
  onChange: (updated: Partial<Eater>) => void;
}) {
  const id = (name: string) => name.replace(/\s+/g, "-").toLowerCase();

  return (
    <>
      {/* Meal choice */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Meal selection</Label>
        <RadioGroup
          value={eater.mealChoice ?? ""}
          onValueChange={(val) => onChange({ mealChoice: val as MealChoice })}
          className="flex flex-col gap-1"
        >
          {MEAL_CHOICES.map((choice) => (
            <div key={choice} className="flex items-center gap-2">
              <RadioGroupItem
                value={choice}
                id={`meal-${id(eater.name)}-${choice}`}
              />
              <Label
                htmlFor={`meal-${id(eater.name)}-${choice}`}
                className="text-sm font-normal"
              >
                {choice}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Dietary restrictions */}
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor={`dietary-${id(eater.name)}`}
          className="text-xs text-muted-foreground"
        >
          Dietary restrictions <span className="font-normal">(optional)</span>
        </Label>
        <Input
          id={`dietary-${id(eater.name)}`}
          value={eater.dietaryRestrictions}
          onChange={(e) =>
            onChange({
              dietaryRestrictions: e.target.value,
            })
          }
          placeholder="e.g. gluten-free, nut allergy"
        />
      </div>
    </>
  );
}

function AttendeeRow({
  attendee,
  onChange,
}: {
  attendee: AttendeeState;
  onChange: (updated: Partial<AttendeeState>) => void;
}) {
  const eaterOnChange = (isPlusOne: boolean, update: Partial<Eater>) =>
    isPlusOne
      ? onChange({ plusOne: { ...attendee.plusOne, ...update } as Eater })
      : onChange(update);

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      {/* Attending yes/no */}
      <div className="flex items-center justify-between gap-3">
        <Label className="font-medium">{attendee.name}</Label>
        <ToggleGroup
          type="single"
          value={attendee.attending ? "yes" : "no"}
          onValueChange={(value: string) => {
            if (!value) return;
            onChange({ attending: value === "yes" });
          }}
          className="gap-1"
        >
          <ToggleGroupItem
            value="yes"
            aria-label={`Mark ${attendee.name} attending`}
            className="h-8 min-w-14"
          >
            Yes
          </ToggleGroupItem>
          <ToggleGroupItem
            value="no"
            aria-label={`Mark ${attendee.name} not attending`}
            className="h-8 min-w-14"
          >
            No
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {attendee.attending && (
        <div className="flex flex-col gap-3 pl-6">
          {attendee.rehearsalDinnerInvited && (
            <div className="flex items-start gap-2 rounded-md border p-2.5">
              <Checkbox
                id={`rehearsal-dinner-${attendee.memberId}`}
                checked={attendee.rehearsalDinnerAttending}
                onCheckedChange={(checked) =>
                  onChange({ rehearsalDinnerAttending: checked === true })
                }
              />
              <div className="flex flex-col gap-0.5">
                <Label
                  htmlFor={`rehearsal-dinner-${attendee.memberId}`}
                  className="text-sm font-medium"
                >
                  Rehearsal dinner
                </Label>
                <p className="text-xs text-muted-foreground">
                  {attendee.name} is invited to the rehearsal dinner the evening
                  before the wedding.
                </p>
              </div>
            </div>
          )}

          <MealSelection
            eater={attendee}
            onChange={(update) => eaterOnChange(false, update)}
          />

          {/* Plus-one */}
          {attendee.plusOneAvailable && (
            <>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`plusone-${attendee.memberId}`}
                  checked={attendee.plusOneSelected}
                  onCheckedChange={(checked) =>
                    onChange({ plusOneSelected: checked === true })
                  }
                />
                <Label
                  htmlFor={`plusone-${attendee.memberId}`}
                  className="text-sm font-normal"
                >
                  Bringing a plus-one?
                </Label>
              </div>

              {attendee.plusOneSelected && attendee.plusOne && (
                <div className="flex flex-col gap-3 rounded-md border border-dashed p-2.5">
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor={`plusone-name-${attendee.memberId}`}
                      className="text-xs text-muted-foreground"
                    >
                      Plus-one Full Name{" "}
                    </Label>
                    <Input
                      id={`plusone-name-${attendee.memberId}`}
                      value={attendee.plusOne?.name ?? ""}
                      onChange={(e) =>
                        onChange({
                          plusOne: {
                            ...attendee.plusOne,
                            name: e.target.value,
                          } as Eater,
                        })
                      }
                      placeholder="Guest's full name"
                    />
                  </div>

                  <MealSelection
                    eater={attendee.plusOne}
                    onChange={(update) => eaterOnChange(true, update)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function DetailsStep({
  reservation,
  onSubmit,
  submitError,
}: {
  reservation: ReservationWithMembersWithRsvp;
  onSubmit: (attendees: AttendeeState[]) => void;
  submitError?: string | null;
}) {
  const [attendees, setAttendees] = useState<AttendeeState[]>(
    buildAttendeeState(reservation),
  );

  function updateAttendee(index: number, update: Partial<AttendeeState>) {
    setAttendees((prev) =>
      prev.map((a, i) => (i === index ? { ...a, ...update } : a)),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(attendees);
  }

  const anyAttending = attendees.some((a) => a.attending);

  const isValid = attendees.every((a) => {
    if (!a.attending) return true;
    if (!a.mealChoice) return false;
    if (
      a.plusOneSelected &&
      a.plusOne &&
      (a.plusOne.name.trim() === "" || !a.plusOne.mealChoice)
    )
      return false;
    return true;
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        <span className="font-medium">{reservation.displayName}</span> — Select
        who&apos;s attending and choose a meal for each person.
      </p>

      <div className="flex flex-col gap-2 max-h-[55vh] overflow-y-auto pr-1">
        {attendees.map((attendee, i) => (
          <AttendeeRow
            key={attendee.memberId}
            attendee={attendee}
            onChange={(update) => updateAttendee(i, update)}
          />
        ))}
      </div>

      <DialogFooter className="flex-col gap-2 sm:flex-col">
        {submitError && (
          <p className="text-sm text-destructive text-center">{submitError}</p>
        )}
        {!anyAttending && (
          <p className="text-xs text-muted-foreground text-center">
            No attendees selected — submitting will record a full decline.
          </p>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={anyAttending && !isValid}
        >
          Submit RSVP
        </Button>
      </DialogFooter>
    </form>
  );
}

function ConfirmationStep({
  reservation,
  attendees,
  onClose,
}: {
  reservation: ReservationWithMembersWithRsvp;
  attendees: AttendeeState[];
  onClose: () => void;
}) {
  const attending = attendees.filter((a) => a.attending);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-medium">
          Thank you, {reservation.displayName.replace(/^The /, "")}!
        </p>
        <p className="text-muted-foreground text-sm">
          Your RSVP has been received.
        </p>
      </div>

      {attending.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          We&apos;re sorry you won&apos;t be able to make it. We hope to
          celebrate with you another time.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium">Attending:</p>
          <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
            {attending.map((a) => (
              <React.Fragment key={a.memberId}>
                <li key={a.memberId}>
                  {a.name} — {a.mealChoice}
                  {a.rehearsalDinnerInvited && (
                    <span>
                      {" "}
                      (Rehearsal dinner:{" "}
                      {a.rehearsalDinnerAttending
                        ? "Attending"
                        : "Not attending"}
                      )
                    </span>
                  )}
                </li>
                {a.plusOneSelected && (
                  <li key={`${a.memberId}-plusone`}>
                    {a.plusOne.name.trim()} (guest of {a.name}) —{" "}
                    {a.plusOne.mealChoice}
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}

      <DialogFooter>
        <Button onClick={onClose} className="w-full">
          Done
        </Button>
      </DialogFooter>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function RSVPForm() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("lookup");
  const [disambiguationOptions, setDisambiguationOptions] =
    useState<ReservationLookupResult | null>(null);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationWithMembersWithRsvp | null>(null);
  const [submittedAttendees, setSubmittedAttendees] = useState<AttendeeState[]>(
    [],
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  function reset() {
    setStep("lookup");
    setDisambiguationOptions(null);
    setSelectedReservation(null);
    setSubmittedAttendees([]);
    setSubmitError(null);
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) reset();
  }

  function handleFound(reservation: ReservationWithMembersWithRsvp) {
    setSelectedReservation(reservation);
    setStep("details");
  }

  function handleDisambiguate(
    reservationLookupResults: ReservationLookupResult,
  ) {
    setDisambiguationOptions(reservationLookupResults);
    setStep("disambiguate");
  }

  function handleDisambiguationSelect(
    reservation: ReservationWithMembersWithRsvp,
    alreadySubmitted: boolean,
  ) {
    if (alreadySubmitted) {
      setStep("already-submitted");
      return;
    }
    setSelectedReservation(reservation);
    setStep("details");
  }

  async function handleSubmit(attendees: AttendeeState[]) {
    setSubmitError(null);
    const result = await submit(selectedReservation!, attendees);
    if (!result.success) {
      setSubmitError(result.error ?? "Something went wrong. Please try again.");
      return;
    }
    setSubmittedAttendees(attendees);
    setStep("confirmation");
  }

  function stepTitle(): string {
    switch (step) {
      case "lookup":
        return "RSVP";
      case "disambiguate":
        return "Select your reservation";
      case "details":
        return "Your RSVP";
      case "confirmation":
        return "You\u2019re all set!";
      case "already-submitted":
        return "Already submitted";
      case "no-results":
        return "Not found";
    }
  }

  return (
    <div className="container flex justify-center">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button>RSVP</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{stepTitle()}</DialogTitle>
          </DialogHeader>

          {step === "lookup" && (
            <LookupStep
              onFound={handleFound}
              onAlreadySubmitted={() => setStep("already-submitted")}
              onNoResults={() => setStep("no-results")}
              onDisambiguate={handleDisambiguate}
            />
          )}

          {step === "disambiguate" && (
            <DisambiguateStep
              reservationLookupResults={disambiguationOptions!}
              onSelect={handleDisambiguationSelect}
            />
          )}

          {step === "details" && selectedReservation && (
            <DetailsStep
              reservation={selectedReservation}
              onSubmit={handleSubmit}
              submitError={submitError}
            />
          )}

          {step === "confirmation" && selectedReservation && (
            <ConfirmationStep
              reservation={selectedReservation}
              attendees={submittedAttendees}
              onClose={() => handleOpenChange(false)}
            />
          )}

          {step === "already-submitted" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                We already have an RSVP on file for your reservation. If you
                need to make a change, please text Collin directly at
                440-865-9314.
              </p>
              <DialogFooter>
                <Button
                  className="w-full"
                  onClick={() => handleOpenChange(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}

          {step === "no-results" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t find a reservation under that name. Please
                double-check your spelling or contact us for help.
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep("lookup")}
                >
                  Try again
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
