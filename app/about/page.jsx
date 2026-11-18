"use client";
import PageShell from "@/components/PageShell";
import { SITE } from "@/lib/site";
import { useLang } from "@/lib/LanguageContext";

export default function AboutPage() {
  const { lang } = useLang();
  return (
    <PageShell title={lang === "bn" ? "আমাদের পরিচিতি" : "About Us"} subtitle={SITE.tagline[lang]}>
      <div className="whitespace-pre-line leading-8 text-gray-800">
        {SITE.about[lang] || SITE.description[lang]}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {SITE.mission && (
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-bold text-emerald-800">{lang === "bn" ? "আমাদের মিশন" : "Our Mission"}</h2>
            <p className="mt-2 leading-8 text-gray-700">{SITE.mission[lang]}</p>
          </div>
        )}
        {SITE.vision && (
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-bold text-emerald-800">{lang === "bn" ? "আমাদের ভিশন" : "Our Vision"}</h2>
            <p className="mt-2 leading-8 text-gray-700">{SITE.vision[lang]}</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
