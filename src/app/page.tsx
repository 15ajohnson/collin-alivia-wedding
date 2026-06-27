import Details from "@/components/details/details";
import Header from "@/components/header/header";
import OurStory from "@/components/ourstory/ourstory";
import Registry from "@/components/registry/registry";
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
          <div className="border-t-10 border-foreground">
            <OurStory />
          </div>
          <div className="border-t-10 border-foreground">
            <RSVP />
          </div>
          <Details />
          <Registry />
        </div>
      )}
    </div>
  );
}
