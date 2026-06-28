import Details from "@/components/details/details";
import Header from "@/components/header/header";
import OurStory from "@/components/ourstory/ourstory";
import ComingSoon from "@/components/comingsoon/comingsoon";
import RSVP from "@/components/rsvp/rsvp";

const comingSoon = process.env.COMING_SOON === "true";

// force dynamic rendering to ensure environment variables are read correctly
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div>
      <Header comingSoon={comingSoon} />
      {comingSoon ? (
        <ComingSoon />
      ) : (
        <div>
          <div id="ourstory" className="border-t-10 border-foreground">
            <OurStory />
          </div>
          <div id="rsvp" className="border-t-10 border-foreground">
            <RSVP />
          </div>
          <div id="details">
            <Details />
          </div>
        </div>
      )}
    </div>
  );
}
