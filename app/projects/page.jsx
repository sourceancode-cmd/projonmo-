"use client";
import { useState } from "react";
import Link from "next/link";
import PageShell, { Status } from "@/components/PageShell";
import FilterTabs from "@/components/FilterTabs";
import { useList, STATUS } from "@/lib/content";
import { useLang } from "@/lib/LanguageContext";

export default function ProjectsPage() {
  const { items, loading, error } = useList("projects");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const { lang } = useLang();

  const categories = [...new Set(items.map((p) => p.category).filter(Boolean))];
  const shown = items.filter((p) => (status === "all" || p.status === status) && (category === "all" || p.category === category));

  return (
    <PageShell title={lang === "bn" ? "আমাদের প্রকল্প" : "Our Projects"} subtitle={lang === "bn" ? "চলমান, আসন্ন ও সম্পন্ন প্রকল্পসমূহ" : "Ongoing, upcoming and completed projects"}>
      <FilterTabs value={status} onChange={setStatus} options={[{ value: "all", label: lang === "bn" ? "সব" : "All" }, ...Object.entries(STATUS).map(([value, label]) => ({ value, label }))]} />
      {categories.length > 1 && (
        <FilterTabs value={category} onChange={setCategory} options={[{ value: "all", label: lang === "bn" ? "সব বিভাগ" : "All Categories" }, ...categories.map((c) => ({ value: c, label: c }))]} />
      )}
      <Status loading={loading} error={error} empty={!shown.length} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <Link key={p.id} href={`/projects/detail?id=${p.id}`} className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
            {p.image && <img src={p.image} alt={p.title} loading="lazy" className="h-48 w-full object-cover" />}
            <div className="p-4">
              <div className="mb-2 flex gap-2 text-xs">
                {p.category && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800">{p.category}</span>}
                {STATUS[p.status] && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">{STATUS[p.status]}</span>}
              </div>
              <h2 className="text-lg font-semibold group-hover:text-emerald-700">{p.title}</h2>
              {p.summary && <p className="mt-1 line-clamp-3 text-sm text-gray-600">{p.summary}</p>}
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
