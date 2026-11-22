"use client";
import PageShell from "@/components/PageShell";
import { useDoc } from "@/lib/content";
import { useLang } from "@/lib/LanguageContext";

export default function AboutPage() {
  const { lang } = useLang();
  const { data: s, loading } = useDoc("settings", "site");

  if (loading) return <div className="p-10 text-center">লোড হচ্ছে...</div>;

  return (
    <PageShell title={lang === "bn" ? "আমাদের পরিচিতি" : "About Us"} subtitle={lang === "bn" ? s?.taglineBn : s?.taglineEn}>
      <div className="whitespace-pre-line leading-8 text-gray-800">
        {lang === "bn" ? s?.aboutBn : s?.aboutEn}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {(lang === "bn" ? s?.missionBn : s?.missionEn) && (
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-bold text-emerald-800">{lang === "bn" ? "আমাদের মিশন" : "Our Mission"}</h2>
            <p className="mt-2 leading-8 text-gray-700">{lang === "bn" ? s?.missionBn : s?.missionEn}</p>
          </div>
        )}
        {(lang === "bn" ? s?.visionBn : s?.visionEn) && (
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-bold text-emerald-800">{lang === "bn" ? "আমাদের ভিশন" : "Our Vision"}</h2>
            <p className="mt-2 leading-8 text-gray-700">{lang === "bn" ? s?.visionBn : s?.visionEn}</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
