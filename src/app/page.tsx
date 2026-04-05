import Details from "@/lib/components/details/details";
import Header from "@/lib/components/header/header";
import OurStory from "@/lib/components/ourstory/ourstory";
import Registry from "@/lib/components/registry/registry";
import RSVPForm from "@/lib/components/rsvp/rsvp";

export default function Home() {
  return (
    <div>
      <Header />
      <OurStory />
      <Details />
      <RSVPForm />
      <Registry />
    </div>
  );
}