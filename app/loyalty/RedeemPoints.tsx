interface Reward {
  amount: string;
  points: string;
  condition: string;
}

const REWARDS: Reward[] = [
  { amount: "€25 OFF", points: "(250 POINTS)", condition: "ON ORDERS ABOVE €150" },
  { amount: "€50 OFF", points: "(500 POINTS)", condition: "ON ORDERS ABOVE €200" },
  { amount: "€75 OFF", points: "(750 POINTS)", condition: "ON ORDERS ABOVE €250" },
  { amount: "€100 OFF", points: "(1000 POINTS)", condition: "ON ORDERS ABOVE €300" },
];

export default function RedeemPoints() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-6 pt-20 pb-14 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
          REDEEM POINTS
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-800 sm:text-lg">
          To show our appreciation, you&apos;ll earn 1 point for every €1 you
          spend. To redeem, simply log in and select an eligible reward at
          checkout. Rewards apply to full-price products only, and points can
          be redeemed 30 days after they are received.
        </p>
      </div>

            <div className="grid grid-cols-2 lg:grid-cols-4">
        {REWARDS.map((reward) => (
          <div
            key={reward.amount}
            className="flex min-h-[280px] flex-col items-center justify-center gap-2 bg-neutral-100 px-4 py-10 text-center sm:min-h-[420px] sm:px-6 sm:py-16"
          >
            <p className="text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
              {reward.amount}
            </p>
            <p className="text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
              {reward.points}
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-600">
              {reward.condition}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}