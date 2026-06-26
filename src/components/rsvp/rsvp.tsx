"use client";

import { OPEN_RSVP_DIALOG_EVENT } from "@/constants/client-events";
import { Button } from "../ui/button";
import RSVPForm from "./rsvp-form";

export default function RSVP() {
  return (
    <>
      <div className="flex justify-center py-12">
        <Button
          onClick={() =>
            window.dispatchEvent(new Event(OPEN_RSVP_DIALOG_EVENT))
          }
        >
          RSVP
        </Button>
      </div>
      <RSVPForm />
    </>
  );
}
