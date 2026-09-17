import Link from "next/link";

export default function BecomeMember() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 bg-white py-20 px-6 text-center">
      <h2 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-6xl">
        BECOME A MEMBER
      </h2>

      <p className="text-sm text-gray-500 sm:text-base">
        Create an account and benefit of being a friend
      </p>

      <div className="mt-4 flex items-center gap-4 text-sm font-semibold sm:text-base">
        <Link
          href="/login"
          className="border-b-2 border-black pb-0.5 text-black"
        >
          Login
        </Link>
        <span className="text-gray-400">OR</span>
        <Link
          href="/register"
          className="border-b-2 border-black pb-0.5 text-black"
        >
          Become a member
        </Link>
      </div>
    </section>
  );
}