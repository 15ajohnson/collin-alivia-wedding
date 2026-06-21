import Details from "@/components/details/details";
import Header from "@/components/header/header";
import OurStory from "@/components/ourstory/ourstory";
import Registry from "@/components/registry/registry";
import RSVPForm from "@/components/rsvp/rsvp";
import ComingSoon from "@/components/comingsoon/comingsoon";

const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true";

export default function Home() {
  return (
    <div>
      <Header />
      {comingSoon ? (
        <ComingSoon />
      ) : (
        <div
          style={{
            backgroundColor: "#F2E8DF",
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
