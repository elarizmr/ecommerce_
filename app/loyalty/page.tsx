import BecomeMember from "./BecomeMember";
import EarnMorePoints from "./EarnMorePoints";
import LoyaltyGallery from "./LoyaltyGallery";
import LoyaltyHero from "./LoyaltyHero";
import LoyaltyTiers from "./LoyaltyTiers";
import RedeemPoints from "./RedeemPoints";

export default function Loyalty() {
  return (
    <div>
      <LoyaltyHero />
      <BecomeMember />
      <LoyaltyTiers />
      <LoyaltyGallery />
      <RedeemPoints />
      <EarnMorePoints />
    </div>
  );
}