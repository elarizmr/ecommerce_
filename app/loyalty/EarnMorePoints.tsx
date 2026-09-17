import Link from "next/link";

interface EarnAction {
  label: string;
  points: string;
  actionLabel: string;
  href: string;
  emphasized?: boolean;
}

const ACTIONS: EarnAction[] = [
  {
    label: "HAPPY BIRTHDAY!",
    points: "+100 points",
    actionLabel: "ADD YOUR BIRTHDAY",
    href: "/account",
  },
  {
    label: "BECOME A MEMBER",
    points: "+25 points",
    actionLabel: "BECOME A MEMBER",
    href: "/register",
    emphasized: true,
  },
  {
    label: "SUBSCRIBE TO OUR NEWSLETTER",
    points: "+25 points",
    actionLabel: "SUBSCRIBE",
    href: "#newsletter",
  },
  {
    label: "FOLLOW US ON INSTAGRAM @OLAFHUSSEIN",
    points: "+10 points",
    actionLabel: "FOLLOW",
    href: "https://instagram.com/olafhussein",
  },
  {
    label: "FOLLOW US ON TIKTOK @OLAFHUSSEIN",
    points: "+10 points",
    actionLabel: "FOLLOW",
    href: "https://tiktok.com/@olafhussein",
  },
];

export default function EarnMorePoints() {
  return (
    <section className="bg-white px-6 pb-24 pt-20 md:px-10 lg:px-16">
      <h2 className="mb-14 text-center text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
        EARN MORE POINTS
      </h2>

      <div className="mx-auto max-w-5xl">
        {ACTIONS.map((action) => (
          <div
            key={action.label}
            className="flex items-center justify-between gap-4 bg-neutral-100 px-6 py-6 md:px-8"
          >
            <p className="text-sm font-bold uppercase tracking-wide text-black md:text-base">
              {action.label}
            </p>

            <div className="flex shrink-0 items-center gap-6">
              <span className="text-sm text-black md:text-base">
                {action.points}
              </span>
              <Link
                href={action.href}
                className={`whitespace-nowrap text-xs uppercase tracking-wide transition-opacity hover:opacity-60 md:text-sm ${
                  action.emphasized
                    ? "font-bold text-black"
                    : "font-medium text-gray-500"
                }`}
              >
                {action.actionLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}