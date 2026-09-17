"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

/**
 * "Stay In The Loop" bölməsi
 * ----------------------------------------------------
 * QEYD: Desktop və mobil versiyalar TAMAMİLƏ AYRI markup
 * bloklarıdır (biri `hidden md:grid`, digəri `block md:hidden`).
 * Eyni grid daxilində "hidden/flex" qarışdırmaq qarışıqlığa səbəb
 * olurdu, ona görə iki tam ayrı struktur yazılıb:
 *
 *  DESKTOP (md+):
 *   - Sol: çərçivəli (padding-li) kiçik şəkil.
 *   - Sağ: tam-bleed şəkil, üzərində abunə kartı.
 *   - Kart STATİKDİR — heç bir sticky/scroll effekti YOXDUR.
 *     Səhifə scroll olunanda kart öz yerində qalır, tərpənmir,
 *     sadəcə bölmə ilə birlikdə normal axında yuxarı/aşağı keçir.
 *
 *  MOBİL / RESPONSIVE (< md):
 *   - Cəmi 1 (tək) şəkil var — konteyner ekrandan hündür
 *     (`min-h-[130vh]`), şəkil bu konteynerin tam arxa fonu.
 *   - Abunə kartı bu tək konteynerin daxilində `sticky top-0`
 *     ilə yerləşib: scroll edəndə kart yavaş-yavaş yuxarı qalxıb
 *     ekranda sabitlənir, konteynerin sonuna çatanda isə sticky-dən
 *     azad olub səhifə ilə birlikdə aşağı davam edir.
 */

export default function StayInTheLoop() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // Burada real newsletter API-nizə (Klaviyo, Mailchimp və s.) sorğu gedir.
    await new Promise((r) => setTimeout(r, 600));
    setStatus("done");
  }

  return (
    <section className="relative w-full bg-white">
      {/* ================= DESKTOP (md+) ================= */}
      {/* Kart STATİKDİR: sticky yoxdur, əlavə vh yoxdur — scroll
          edəndə tərpənmir, öz yerində qalır. */}
      <div className="hidden md:grid md:grid-cols-2">
        {/* Sol: çərçivəli kiçik şəkil */}
        <div className="relative flex h-[100vh] items-center justify-center bg-white p-16 lg:p-20">
          <div className="relative aspect-[3/4] h-full max-h-[65vh] w-full max-w-lg overflow-hidden">
            <Image
              src="/images/1.jpg"
              alt="OLAF toxuma trikotaj geyinmiş model, arxadan"
              fill
              sizes="40vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Sağ: tam-bleed şəkil + STATİK (tərpənməyən) kart */}
        <div className="relative h-[100vh] w-full">
          <Image
            src="/images/1.jpg"
            alt="OLAF toxuma trikotaj geyinmiş model, yaxın plan"
            fill
            sizes="50vw"
            className="object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center px-10 lg:px-16">
            <SubscribeForm
              email={email}
              setEmail={setEmail}
              status={status}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* ================= MOBİL / RESPONSIVE (< md) ================= */}
      {/* Cəmi 1 şəkil var. Kart bu şəklin daxilində sticky —
          scroll zamanı yuxarı qalxır, sonra səhifə ilə aşağı davam edir. */}
      <div className="relative min-h-[130vh] w-full md:hidden">
        <Image
          src="/images/1.jpg"
          alt="OLAF toxuma trikotaj geyinmiş model"
          fill
          sizes="100vw"
          className="object-cover"
        />

        <div className="sticky top-0 flex h-screen w-full items-center justify-center px-6 sm:px-10">
          <SubscribeForm
            email={email}
            setEmail={setEmail}
            status={status}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </section>
  );
}

function SubscribeForm({
  email,
  setEmail,
  status,
  onSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  status: "idle" | "loading" | "done";
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    // max-w-[22rem] (kiçik en) sayəsində kartın sol/sağ tərəflərindən
    // arxadakı şəklin kənarları görünür.
    <div className="w-full max-w-[22rem] bg-white px-8 py-10 text-center shadow-[0_0_40px_rgba(0,0,0,0.06)] sm:px-10 sm:py-12">
      <h2 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">
        Stay in the loop
      </h2>

      <p className="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-base">
        Sign up for the OLAF newsletter and receive 10% off your first order.
        Be the first to discover new collections, collaborations, receive
        event invitations, and unlock exclusive benefits through our loyalty
        program.
      </p>

      {status === "done" ? (
        <p className="mt-10 text-sm font-medium uppercase tracking-wide">
          Thanks — you're on the list.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8">
          {/* Email input balaca/dar saxlanılıb, tam eni tutmur */}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="mx-auto w-full max-w-[200px] border-0 border-b border-black bg-transparent pb-2 text-center text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-0"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-8 w-full max-w-[200px] bg-black py-3 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}

      <p className="mt-10 text-xs text-neutral-500">
        We will never share your email with anyone else.
      </p>
    </div>
  );
}