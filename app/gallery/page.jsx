"use client";
import { useState } from "react";
import PageShell, { Status } from "@/components/PageShell";
import FilterTabs from "@/components/FilterTabs";
import { useList } from "@/lib/content";
import { useLang } from "@/lib/LanguageContext";

export default function GalleryPage() {
  const { items, loading, error } = useList("gallery");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(null);
  const { lang } = useLang();

  const categories = [...new Set(items.map((g) => g.category).filter(Boolean))];
  const shown = items.filter((g) => category === "all" || g.category === category);

  return (
    <PageShell title={lang === "bn" ? "গ্যালারি" : "Gallery"} subtitle={lang === "bn" ? "আমাদের কার্যক্রমের ছবি" : "Photos of our activities"}>
      {categories.length > 1 && (
        <FilterTabs value={category} onChange={setCategory} options={[{ value: "all", label: lang === "bn" ? "সব" : "All" }, ...categories.map((c) => ({ value: c, label: c }))]} />
      )}
      <Status loading={loading} error={error} empty={!shown.length} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((g) => (
          <button key={g.id} type="button" onClick={() => setOpen(g)} className="overflow-hidden rounded-lg">
            <img src={g.image} alt={lang === "bn" ? g.captionBn : g.captionEn} loading="lazy" className="aspect-square w-full object-cover transition hover:scale-105" />
          </button>
        ))}
      </div>
      {open && (
        <div role="dialog" aria-modal="true" onClick={() => setOpen(null)} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4">
          <img src={open.image} alt={lang === "bn" ? open.captionBn : open.captionEn} className="max-h-[80vh] max-w-full rounded-lg" />
          <p className="mt-3 text-center text-white">{lang === "bn" ? open.captionBn : open.captionEn}</p>
          <button type="button" className="mt-4 rounded-full bg-white px-5 py-1.5 text-sm">{lang === "bn" ? "বন্ধ করুন" : "Close"}</button>
        </div>
      )}
    </PageShell>
  );
}
