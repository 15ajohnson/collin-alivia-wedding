import Details from "@/lib/components/details/details";
import Header from "@/lib/components/header/header";
import OurStory from "@/lib/components/ourstory/ourstory";
import Registry from "@/lib/components/registry/registry";
import RSVPForm from "@/lib/components/rsvp/rsvp";
import ComingSoon from "@/lib/components/comingsoon/comingsoon";

const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true";

export default function Home() {
  return (
    <div>
      <Header />
      {comingSoon ? (
        <ComingSoon />
      ) : (
        <>
          <OurStory />
          <Details />
          <RSVPForm />
          <Registry />
        </>
      )}
    </div>
  );
}