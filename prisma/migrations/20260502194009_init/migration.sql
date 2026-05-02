-- CreateTable
CREATE TABLE "reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "last_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "max_seats" INTEGER NOT NULL,
    "rehearsal_dinner_invited" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "reservation_member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reservation_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    CONSTRAINT "reservation_member_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rsvp" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reservation_id" INTEGER NOT NULL,
    "rehearsal_dinner_attending" BOOLEAN,
    "submitted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rsvp_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rsvp_attendee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rsvp_id" INTEGER NOT NULL,
    "reservation_member_id" INTEGER,
    "plus_one_name" TEXT,
    "meal_choice" TEXT NOT NULL,
    "dietary_restrictions" TEXT,
    CONSTRAINT "rsvp_attendee_rsvp_id_fkey" FOREIGN KEY ("rsvp_id") REFERENCES "rsvp" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "rsvp_attendee_reservation_member_id_fkey" FOREIGN KEY ("reservation_member_id") REFERENCES "reservation_member" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "reservation_last_name_idx" ON "reservation"("last_name");

-- CreateIndex
CREATE UNIQUE INDEX "rsvp_reservation_id_key" ON "rsvp"("reservation_id");

-- CreateIndex
CREATE UNIQUE INDEX "rsvp_attendee_reservation_member_id_key" ON "rsvp_attendee"("reservation_member_id");
