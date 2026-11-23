"use client";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import { useList, useDoc } from "@/lib/content";
import { useLang } from "@/lib/LanguageContext";

export default function HomePage() {
  const { items: projects } = useList("projects");
  const { items: workItems } = useList("work");
  const { data: s } = useDoc("settings", "site");
  const { lang } = useLang();

  return (
    <main>
      <HeroSlider />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-3xl font-bold">
          {lang === "bn" ? "আমাদের কার্যক্রম" : "Our Activities"}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {workItems.map((w) => (
            <div key={w.id} className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-emerald-800">
                {lang === "bn" ? w.titleBn : w.titleEn}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {lang === "bn" ? w.textBn : w.textEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-emerald-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-bold">{lang === "bn" ? "আমাদের পরিচয়" : "About Us"}</h2>
          <p className="mt-4 max-w-3xl leading-8 text-gray-700">
            {lang === "bn" ? s?.descriptionBn : s?.descriptionEn}
          </p>
          <Link href="/about" className="mt-6 inline-block rounded-full bg-emerald-700 px-6 py-2.5 font-semibold text-white hover:bg-emerald-800">
            {lang === "bn" ? "বিস্তারিত জানুন" : "Learn More"}
          </Link>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold">{lang === "bn" ? "আমাদের প্রকল্প" : "Our Projects"}</h2>
            <Link href="/projects" className="text-sm font-medium text-emerald-700 underline">
              {lang === "bn" ? "সব প্রকল্প" : "All Projects"}
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <Link key={p.id} href={`/projects/detail?id=${p.id}`} className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
                {p.image && <img src={p.image} alt={p.titleBn} loading="lazy" className="h-48 w-full object-cover" />}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{lang === "bn" ? p.titleBn : p.titleEn}</h3>
                  <p className="mt-1 line-clamp-3 text-sm text-gray-600">
                    {lang === "bn" ? p.summaryBn : p.summaryEn}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {s?.leaderMessageBn && (
        <section className="bg-gray-50">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-[220px_1fr]">
            {s.leaderPhoto && <img src={s.leaderPhoto} alt={s.leaderName || ""} className="mx-auto w-48 rounded-xl" />}
            <div>
              <h2 className="text-2xl font-bold">{s.leaderName}</h2>
              <p className="text-sm text-gray-600">{lang === "bn" ? s.leaderRoleBn : s.leaderRoleEn}</p>
              <p className="mt-4 line-clamp-5 leading-8 text-gray-700">
                {lang === "bn" ? s.leaderMessageBn : s.leaderMessageEn}
              </p>
              <Link href="/about/message" className="mt-3 inline-block text-emerald-700 underline">
                {lang === "bn" ? "পুরো বাণী পড়ুন" : "Read Full Message"}
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-14 text-center">
        <h2 className="text-3xl font-bold">{lang === "bn" ? "আমাদের সাথে যুক্ত হোন" : "Join Us"}</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/volunteer" className="rounded-full bg-emerald-700 px-6 py-2.5 font-semibold text-white hover:bg-emerald-800">
            {lang === "bn" ? "স্বেচ্ছাসেবক হোন" : "Become a Volunteer"}
          </Link>
          <Link href="/donate" className="rounded-full border border-emerald-700 px-6 py-2.5 font-semibold text-emerald-800">
            {lang === "bn" ? "অনুদান দিন" : "Donate Now"}
          </Link>
        </div>
      </section>
    </main>
  );
}
