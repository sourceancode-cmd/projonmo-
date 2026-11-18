"use client";
import PageShell, { Status } from "@/components/PageShell";
import { useList } from "@/lib/content";
import { useLang } from "@/lib/LanguageContext";

export default function PartnersPage() {
  const { items, loading, error } = useList("partners");
  const { lang } = useLang();

  return (
    <PageShell title={lang === "bn" ? "সহযোগী প্রতিষ্ঠান" : "Partners"} subtitle={lang === "bn" ? "যারা আমাদের সাথে কাজ করছে" : "Organizations working with us"}>
      <Status loading={loading} error={error} empty={!items.length} />
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <a key={p.id} href={p.url || "#"} target={p.url ? "_blank" : "_self"} rel="noopener noreferrer" className="flex flex-col items-center justify-center rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
            {p.logo ? <img src={p.logo} alt={p.name} loading="lazy" className="h-20 w-full object-contain" /> : <div className="h-20 w-full bg-gray-100" />}
            <p className="mt-4 text-center font-semibold text-gray-800">{p.name}</p>
          </a>
        ))}
      </div>
    </PageShell>
  );
}
