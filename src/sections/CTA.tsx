import { DynamicSpotlightCTA } from "../components/ui/dynamic-spotlight-cta";

export default function CTA() {
  return (
    <DynamicSpotlightCTA
      heading={`Your next escape\nstarts here.`}
      subheading="Wake up to the misty hills of the Eastern Himalayas. Faith The Retreat offers warm rooms, home-cooked breakfast and a team that treats every guest like family — all just minutes from Bagdogra Airport and NJP Railway Station."
      primaryLabel="Explore Rooms"
      primaryHref="#rooms"
      secondaryLabel="Contact Us"
      secondaryHref="#contact"
    />
  );
}
