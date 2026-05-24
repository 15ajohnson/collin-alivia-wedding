
export const MEAL_CHOICES = [
    "Herb-Roasted Chicken",
    "Pan-Seared Salmon",
    "Wild Mushroom Risotto (Vegetarian)",
] as const;

export type MealChoice = (typeof MEAL_CHOICES)[number];