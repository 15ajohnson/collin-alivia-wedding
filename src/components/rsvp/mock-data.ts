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
}

export interface MockReservation {
    id: number;
    lastName: string;
    displayName: string;
    rehearsalDinnerInvited: boolean;
    members: MockReservationMember[];
    alreadySubmitted: boolean;
}

export const MOCK_RESERVATIONS: MockReservation[] = [
    {
        id: 1,
        lastName: "smith",
        displayName: "The Smith Family",
        rehearsalDinnerInvited: true,
        members: [
            { id: 1, firstName: "John", hasPlus_one: false },
            { id: 2, firstName: "Jane", hasPlus_one: false },
            { id: 3, firstName: "Emily", hasPlus_one: true },
        ],
        alreadySubmitted: false,
    },
    {
        id: 2,
        lastName: "smith",
        displayName: "Bob & Alice Smith",
        rehearsalDinnerInvited: false,
        members: [
            { id: 4, firstName: "Bob", hasPlus_one: true },
            { id: 5, firstName: "Alice", hasPlus_one: false },
        ],
        alreadySubmitted: false,
    },
    {
        id: 3,
        lastName: "johnson",
        displayName: "The Johnson Family",
        rehearsalDinnerInvited: false,
        members: [
            { id: 6, firstName: "Michael", hasPlus_one: false },
            { id: 7, firstName: "Sarah", hasPlus_one: false },
        ],
        alreadySubmitted: true,
    },
    {
        id: 4,
        lastName: "williams",
        displayName: "David & Emma Williams",
        rehearsalDinnerInvited: false,
        members: [
            { id: 8, firstName: "David", hasPlus_one: true },
            { id: 9, firstName: "Emma", hasPlus_one: false },
        ],
        alreadySubmitted: false,
    },
];

export function mockLookupReservation(lastName: string): MockReservation[] {
    const normalized = lastName.trim().toLowerCase();
    return MOCK_RESERVATIONS.filter((r) => r.lastName === normalized);
}
