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
    MEAL_CHOICES,
    type MealChoice,
    type MockReservation,
    mockLookupReservation,
} from "./mock-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AttendeeState {
    memberId: number;
    firstName: string;
    hasPlus_one: boolean;
    attending: boolean;
    mealChoice: MealChoice | "";
    dietaryRestrictions: string;
    plusOneName: string;
    plusOneMealChoice: MealChoice | "";
    plusOneDietaryRestrictions: string;
}

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

function buildAttendeeState(reservation: MockReservation): AttendeeState[] {
    return reservation.members.map((m) => ({
        memberId: m.id,
        firstName: m.firstName,
        hasPlus_one: m.hasPlus_one,
        attending: false,
        mealChoice: "",
        dietaryRestrictions: "",
        plusOneName: "",
        plusOneMealChoice: "",
        plusOneDietaryRestrictions: "",
    }));
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
    onFound: (reservation: MockReservation) => void;
    onAlreadySubmitted: () => void;
    onNoResults: () => void;
    onDisambiguate: (reservations: MockReservation[]) => void;
}) {
    const [lastName, setLastName] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const results = mockLookupReservation(lastName);

        if (results.length === 0) {
            onNoResults();
            return;
        }

        if (results.length === 1) {
            if (results[0].alreadySubmitted) {
                onAlreadySubmitted();
            } else {
                onFound(results[0]);
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
    reservations,
    onSelect,
}: {
    reservations: MockReservation[];
    onSelect: (reservation: MockReservation) => void;
}) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    function handleContinue() {
        const reservation = reservations.find((r) => r.id === selectedId);
        if (!reservation) return;
        onSelect(reservation);
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
                {reservations.map((r) => (
                    <div key={r.id} className="flex items-center gap-2">
                        <RadioGroupItem
                            value={r.id.toString()}
                            id={`reservation-${r.id}`}
                        />
                        <Label htmlFor={`reservation-${r.id}`}>
                            {r.displayName}
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

function AttendeeRow({
    attendee,
    onChange,
}: {
    attendee: AttendeeState;
    onChange: (updated: Partial<AttendeeState>) => void;
}) {
    const showPlusOneMeal =
        attendee.hasPlus_one &&
        attendee.attending &&
        attendee.plusOneName.trim() !== "";

    return (
        <div className="flex flex-col gap-3 rounded-lg border p-3">
            {/* Attending yes/no */}
            <div className="flex items-center justify-between gap-3">
                <Label className="font-medium">{attendee.firstName}</Label>
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
                        aria-label={`Mark ${attendee.firstName} attending`}
                        className="h-8 min-w-14"
                    >
                        Yes
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="no"
                        aria-label={`Mark ${attendee.firstName} not attending`}
                        className="h-8 min-w-14"
                    >
                        No
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            {attendee.attending && (
                <div className="flex flex-col gap-3 pl-6">
                    {/* Meal choice */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-muted-foreground">
                            Meal selection
                        </Label>
                        <RadioGroup
                            value={attendee.mealChoice}
                            onValueChange={(val) =>
                                onChange({ mealChoice: val as MealChoice })
                            }
                            className="flex flex-col gap-1"
                        >
                            {MEAL_CHOICES.map((choice) => (
                                <div
                                    key={choice}
                                    className="flex items-center gap-2"
                                >
                                    <RadioGroupItem
                                        value={choice}
                                        id={`meal-${attendee.memberId}-${choice}`}
                                    />
                                    <Label
                                        htmlFor={`meal-${attendee.memberId}-${choice}`}
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
                            htmlFor={`dietary-${attendee.memberId}`}
                            className="text-xs text-muted-foreground"
                        >
                            Dietary restrictions{" "}
                            <span className="font-normal">(optional)</span>
                        </Label>
                        <Input
                            id={`dietary-${attendee.memberId}`}
                            value={attendee.dietaryRestrictions}
                            onChange={(e) =>
                                onChange({
                                    dietaryRestrictions: e.target.value,
                                })
                            }
                            placeholder="e.g. gluten-free, nut allergy"
                        />
                    </div>

                    {/* Plus-one */}
                    {attendee.hasPlus_one && (
                        <div className="flex flex-col gap-3 rounded-md border border-dashed p-2.5">
                            <div className="flex flex-col gap-1.5">
                                <Label
                                    htmlFor={`plusone-name-${attendee.memberId}`}
                                    className="text-xs text-muted-foreground"
                                >
                                    Plus-one Full Name{" "}
                                    <span className="font-normal">
                                        (optional)
                                    </span>
                                </Label>
                                <Input
                                    id={`plusone-name-${attendee.memberId}`}
                                    value={attendee.plusOneName}
                                    onChange={(e) =>
                                        onChange({
                                            plusOneName: e.target.value,
                                            ...(e.target.value.trim() === "" && {
                                                plusOneMealChoice: "",
                                                plusOneDietaryRestrictions: "",
                                            }),
                                        })
                                    }
                                    placeholder="Guest's full name"
                                />
                            </div>

                            {showPlusOneMeal && (
                                <>
                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-xs text-muted-foreground">
                                            {attendee.plusOneName.trim()}&apos;s
                                            meal selection
                                        </Label>
                                        <RadioGroup
                                            value={attendee.plusOneMealChoice}
                                            onValueChange={(val) =>
                                                onChange({
                                                    plusOneMealChoice:
                                                        val as MealChoice,
                                                })
                                            }
                                            className="flex flex-col gap-1"
                                        >
                                            {MEAL_CHOICES.map((choice) => (
                                                <div
                                                    key={choice}
                                                    className="flex items-center gap-2"
                                                >
                                                    <RadioGroupItem
                                                        value={choice}
                                                        id={`plusone-meal-${attendee.memberId}-${choice}`}
                                                    />
                                                    <Label
                                                        htmlFor={`plusone-meal-${attendee.memberId}-${choice}`}
                                                        className="text-sm font-normal"
                                                    >
                                                        {choice}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label
                                            htmlFor={`plusone-dietary-${attendee.memberId}`}
                                            className="text-xs text-muted-foreground"
                                        >
                                            {attendee.plusOneName.trim()}&apos;s
                                            dietary restrictions{" "}
                                            <span className="font-normal">
                                                (optional)
                                            </span>
                                        </Label>
                                        <Input
                                            id={`plusone-dietary-${attendee.memberId}`}
                                            value={
                                                attendee.plusOneDietaryRestrictions
                                            }
                                            onChange={(e) =>
                                                onChange({
                                                    plusOneDietaryRestrictions:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="e.g. gluten-free, nut allergy"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function DetailsStep({
    reservation,
    onSubmit,
}: {
    reservation: MockReservation;
    onSubmit: (attendees: AttendeeState[], rehearsalDinner: boolean | null) => void;
}) {
    const [attendees, setAttendees] = useState<AttendeeState[]>(
        buildAttendeeState(reservation)
    );
    const [rehearsalDinner, setRehearsalDinner] = useState(false);

    function updateAttendee(index: number, update: Partial<AttendeeState>) {
        setAttendees((prev) =>
            prev.map((a, i) => (i === index ? { ...a, ...update } : a))
        );
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(
            attendees,
            reservation.rehearsalDinnerInvited ? rehearsalDinner : null
        );
    }

    const anyAttending = attendees.some((a) => a.attending);

    const isValid = attendees.every((a) => {
        if (!a.attending) return true;
        if (!a.mealChoice) return false;
        if (a.hasPlus_one && a.plusOneName.trim() !== "" && !a.plusOneMealChoice)
            return false;
        return true;
    });

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
                <span className="font-medium text-foreground">
                    {reservation.displayName}
                </span>{" "}
                — Select who&apos;s attending and choose a meal for each person.
            </p>

            <div className="flex flex-col gap-2 max-h-[55vh] overflow-y-auto pr-1">
                {attendees.map((attendee, i) => (
                    <AttendeeRow
                        key={attendee.memberId}
                        attendee={attendee}
                        onChange={(update) => updateAttendee(i, update)}
                    />
                ))}

                {reservation.rehearsalDinnerInvited && (
                    <div className="flex items-start gap-2 rounded-lg border p-3">
                        <Checkbox
                            id="rehearsal-dinner"
                            checked={rehearsalDinner}
                            onCheckedChange={(checked) =>
                                setRehearsalDinner(checked === true)
                            }
                        />
                        <div className="flex flex-col gap-0.5">
                            <Label
                                htmlFor="rehearsal-dinner"
                                className="font-medium"
                            >
                                Rehearsal dinner
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Your party is invited to the rehearsal dinner
                                the evening before the wedding. Will your party
                                be attending?
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-col">
                {!anyAttending && (
                    <p className="text-xs text-muted-foreground text-center">
                        No attendees selected — submitting will record a full
                        decline.
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
    rehearsalDinner,
    onClose,
}: {
    reservation: MockReservation;
    attendees: AttendeeState[];
    rehearsalDinner: boolean | null;
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
                    We&apos;re sorry you won&apos;t be able to make it. We hope
                    to celebrate with you another time.
                </p>
            ) : (
                <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium">Attending:</p>
                    <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                        {attending.map((a) => (
                            <>
                                <li key={a.memberId}>
                                    {a.firstName} — {a.mealChoice}
                                </li>
                                {a.plusOneName.trim() !== "" && (
                                    <li key={`${a.memberId}-plusone`}>
                                        {a.plusOneName.trim()} (guest of{" "}
                                        {a.firstName}) — {a.plusOneMealChoice}
                                    </li>
                                )}
                            </>
                        ))}
                    </ul>
                    {rehearsalDinner !== null && (
                        <p className="text-sm text-muted-foreground mt-1">
                            Rehearsal dinner:{" "}
                            <span className="font-medium">
                                {rehearsalDinner ? "Attending" : "Not attending"}
                            </span>
                        </p>
                    )}
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
    const [disambiguationOptions, setDisambiguationOptions] = useState<
        MockReservation[]
    >([]);
    const [selectedReservation, setSelectedReservation] =
        useState<MockReservation | null>(null);
    const [submittedAttendees, setSubmittedAttendees] = useState<
        AttendeeState[]
    >([]);
    const [submittedRehearsalDinner, setSubmittedRehearsalDinner] = useState<
        boolean | null
    >(null);

    function reset() {
        setStep("lookup");
        setDisambiguationOptions([]);
        setSelectedReservation(null);
        setSubmittedAttendees([]);
        setSubmittedRehearsalDinner(null);
    }

    function handleOpenChange(isOpen: boolean) {
        setOpen(isOpen);
        if (!isOpen) reset();
    }

    function handleFound(reservation: MockReservation) {
        setSelectedReservation(reservation);
        setStep("details");
    }

    function handleDisambiguate(reservations: MockReservation[]) {
        setDisambiguationOptions(reservations);
        setStep("disambiguate");
    }

    function handleDisambiguationSelect(reservation: MockReservation) {
        if (reservation.alreadySubmitted) {
            setStep("already-submitted");
            return;
        }
        setSelectedReservation(reservation);
        setStep("details");
    }

    function handleSubmit(
        attendees: AttendeeState[],
        rehearsalDinner: boolean | null
    ) {
        setSubmittedAttendees(attendees);
        setSubmittedRehearsalDinner(rehearsalDinner);
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
                            onAlreadySubmitted={() =>
                                setStep("already-submitted")
                            }
                            onNoResults={() => setStep("no-results")}
                            onDisambiguate={handleDisambiguate}
                        />
                    )}

                    {step === "disambiguate" && (
                        <DisambiguateStep
                            reservations={disambiguationOptions}
                            onSelect={handleDisambiguationSelect}
                        />
                    )}

                    {step === "details" && selectedReservation && (
                        <DetailsStep
                            reservation={selectedReservation}
                            onSubmit={handleSubmit}
                        />
                    )}

                    {step === "confirmation" && selectedReservation && (
                        <ConfirmationStep
                            reservation={selectedReservation}
                            attendees={submittedAttendees}
                            rehearsalDinner={submittedRehearsalDinner}
                            onClose={() => handleOpenChange(false)}
                        />
                    )}

                    {step === "already-submitted" && (
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-muted-foreground">
                                We already have an RSVP on file for your
                                reservation. If you need to make a change,
                                please reach out to us directly.
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
                                We couldn&apos;t find a reservation under that
                                name. Please double-check your spelling or
                                contact us for help.
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