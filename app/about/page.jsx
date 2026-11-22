"use client";
import PageShell from "@/components/PageShell";
import { useDoc } from "@/lib/content";
import { useLang } from "@/lib/LanguageContext";

export default function AboutPage() {
  const { lang } = useLang();
  const { data: s, loading } = useDoc("settings", "site");

  if (loading) return <div className="p-10 text-center">লোড হচ্ছে...</div>;

  return (
    <PageShell title={lang === "bn" ? "আমাদের পরিচিতি" : "About Us"} subtitle={s?.tagline || ""}>
      <div className="whitespace-pre-line leading-8 text-gray-800">
        {s?.about || s?.description || ""}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {s?.mission && (
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-bold text-emerald-800">{lang === "bn" ? "আমাদের মিশন" : "Our Mission"}</h2>
            <p className="mt-2 leading-8 text-gray-700">{s.mission}</p>
          </div>
        )}
        {s?.vision && (
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-bold text-emerald-800">{lang === "bn" ? "আমাদের ভিশন" : "Our Vision"}</h2>
            <p className="mt-2 leading-8 text-gray-700">{s.vision}</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
