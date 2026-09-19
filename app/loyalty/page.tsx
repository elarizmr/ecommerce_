import BecomeMember from "./BecomeMember";

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
     
    </div>
  );
}