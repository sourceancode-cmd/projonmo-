"use client";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import { useList, useDoc } from "@/lib/content";
import { SITE, WORK, STATS } from "@/lib/site";

export default function HomePage() {
  const { items: projects } = useList("projects");
  const { data: s } = useDoc("settings", "site");

  return (
    <main>
      <HeroSlider />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-3xl font-bold">আমাদের কার্যক্রম</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {WORK.map((w) => (
            <div key={w.title} className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-emerald-800">{w.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-emerald-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-bold">আমাদের পরিচয়</h2>
          <p className="mt-4 max-w-3xl leading-8 text-gray-700">{SITE.description}</p>
          <Link
            href="/about"
            className="mt-6 inline-block rounded-full bg-emerald-700 px-6 py-2.5 font-semibold text-white hover:bg-emerald-800"
          >
            বিস্তারিত জানুন
          </Link>
        </div>
      </section>

      {STATS.length > 0 && (
        <section className="bg-emerald-800 text-white">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 text-center md:grid-cols-4">
            {STATS.map((x) => (
              <div key={x.label}>
                <p className="text-3xl font-bold">{x.value}</p>
                <p className="mt-1 text-sm text-emerald-100">{x.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold">আমাদের প্রকল্প</h2>
            <Link href="/projects" className="text-sm font-medium text-emerald-700 underline">
              সব প্রকল্প
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href={`/projects/detail?id=${p.id}`}
                className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
              >
                {p.image && (
                  <img src={p.image} alt={p.title} loading="lazy" className="h-48 w-full object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  {p.summary && (
                    <p className="mt-1 line-clamp-3 text-sm text-gray-600">{p.summary}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {s?.leaderMessage && (
        <section className="bg-gray-50">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-[220px_1fr]">
            {s.leaderPhoto && (
              <img src={s.leaderPhoto} alt={s.leaderName || ""} className="mx-auto w-48 rounded-xl" />
            )}
            <div>
              <h2 className="text-2xl font-bold">{s.leaderName}</h2>
              <p className="text-sm text-gray-600">{s.leaderRole}</p>
              <p className="mt-4 line-clamp-5 leading-8 text-gray-700">{s.leaderMessage}</p>
              <Link href="/about/message" className="mt-3 inline-block text-emerald-700 underline">
                পুরো বাণী পড়ুন
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-14 text-center">
        <h2 className="text-3xl font-bold">আমাদের সাথে যুক্ত হোন</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/volunteer"
            className="rounded-full bg-emerald-700 px-6 py-2.5 font-semibold text-white hover:bg-emerald-800"
          >
            স্বেচ্ছাসেবক হোন
          </Link>
          <Link
            href="/donate"
            className="rounded-full border border-emerald-700 px-6 py-2.5 font-semibold text-emerald-800"
          >
            অনুদান দিন
          </Link>
        </div>
      </section>
    </main>
  );
}
