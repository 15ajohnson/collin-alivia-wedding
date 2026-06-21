import Details from "@/components/details/details";
import Header from "@/components/header/header";
import OurStory from "@/components/ourstory/ourstory";
import Registry from "@/components/registry/registry";
import RSVPForm from "@/components/rsvp/rsvp";
import ComingSoon from "@/components/comingsoon/comingsoon";

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
        <div
          style={{
            backgroundColor: "#F2E8DF",
            backgroundImage: "url('/noise-bg.svg')",
          }}
        >
          <OurStory />
          <Details />
          <RSVPForm />
          <Registry />
        </div>
      )}
    </div>
  );
}
