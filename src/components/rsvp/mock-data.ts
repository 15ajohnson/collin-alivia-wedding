export const MEAL_CHOICES = [
    "Herb-Roasted Chicken",
    "Pan-Seared Salmon",
    "Wild Mushroom Risotto (Vegetarian)",
] as const;

export type MealChoice = (typeof MEAL_CHOICES)[number];

export interface MockReservationMember {
    id: number;
    firstName: string;
    hasPlus_one: boolean;
    rehearsalDinnerInvited: boolean;
}

export interface MockReservation {
    id: number;
    lastName: string;
    displayName: string;
    members: MockReservationMember[];
    alreadySubmitted: boolean;
}

export const MOCK_RESERVATIONS: MockReservation[] = [
    {
        id: 1,
        lastName: "smith",
        displayName: "The Smith Family",
        members: [
            { id: 1, firstName: "John", hasPlus_one: false, rehearsalDinnerInvited: true },
            { id: 2, firstName: "Jane", hasPlus_one: false, rehearsalDinnerInvited: false },
            { id: 3, firstName: "Emily", hasPlus_one: true, rehearsalDinnerInvited: true },
        ],
        alreadySubmitted: false,
    },
    {
        id: 2,
        lastName: "smith",
        displayName: "Bob & Alice Smith",
        members: [
            { id: 4, firstName: "Bob", hasPlus_one: true, rehearsalDinnerInvited: false },
            { id: 5, firstName: "Alice", hasPlus_one: false, rehearsalDinnerInvited: false },
        ],
        alreadySubmitted: false,
    },
    {
        id: 3,
        lastName: "johnson",
        displayName: "The Johnson Family",
        members: [
            { id: 6, firstName: "Michael", hasPlus_one: false, rehearsalDinnerInvited: true },
            { id: 7, firstName: "Sarah", hasPlus_one: false, rehearsalDinnerInvited: true },
        ],
        alreadySubmitted: true,
    },
    {
        id: 4,
        lastName: "williams",
        displayName: "David & Emma Williams",
        members: [
            { id: 8, firstName: "David", hasPlus_one: true, rehearsalDinnerInvited: false },
            { id: 9, firstName: "Emma", hasPlus_one: false, rehearsalDinnerInvited: true },
        ],
        alreadySubmitted: false,
    },
];

export function mockLookupReservation(lastName: string): MockReservation[] {
    const normalized = lastName.trim().toLowerCase();
    return MOCK_RESERVATIONS.filter((r) => r.lastName === normalized);
}
