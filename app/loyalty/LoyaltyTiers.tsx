interface Tier {
  name: string;
  subtitle: string;
  threshold: string;
  perks: string[];
}

const TIERS: Tier[] = [
  {
    name: "FRIENDS",
    subtitle: "Joined together",
    threshold: "You start here",
    perks: [
      "1 POINT PER € SPENT",
      "SECOND PRIORITY TO SALE",
      "REFER A FRIEND AND GET REWARDED",
      "BIRTHDAY REWARD",
      "SECOND PRIORITY TO SIGN UP TO EVENTS",
    ],
  },
  {
    name: "BEST FRIENDS",
    subtitle: "Spend €500",
    threshold: "Spend €500",
    perks: [
      "1 POINT PER € SPENT",
      "REFER A FRIEND AND GET REWARDED",
      "BIRTHDAY REWARD",
      "EXCLUSIVE OFFERS",
      "EARLY PREVIEW ON NEW COLLECTIONS AND COLLABS",
      "FIRST PRIORITY TO SALE",
      "FIRST PRIORITY TO SIGN UP TO EVENTS",
    ],
  },
  {
    name: "FAMILY",
    subtitle: "Spend €1000",
    threshold: "Spend €1.000",
    perks: [
      "FIRST PRIORITY TO SALE",
      "REFER A FRIEND AND GET REWARDED",
      "BIRTHDAY REWARD",
      "FREE DELIVERY ON ALL ORDERS",
      "1.5 POINT PER € SPENT",
      "EXCLUSIVE OFFERS",
      "EARLY PREVIEW ON NEW COLLECTIONS AND COLLABS",
      "FIRST PRIORITY TO SIGN UP TO EVENTS",
    ],
  },
];

export default function LoyaltyTiers() {
  return (
    <section className="bg-white px-6 py-16 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="flex flex-col bg-neutral-100 px-8 py-10 md:px-10"
          >
            <h3 className="text-4xl font-bold leading-[1.05] tracking-tight text-black md:text-5xl">
              {tier.name}
            </h3>
            <p className="mt-2 text-base text-gray-500">{tier.subtitle}</p>

            <div className="mt-10 flex flex-col gap-3">
              <p className="text-base text-black">{tier.threshold}</p>
              {tier.perks.map((perk) => (
                <p
                  key={perk}
                  className="text-[13px] font-bold uppercase tracking-wide text-black"
                >
                  {perk}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}