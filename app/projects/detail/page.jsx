"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PageShell, { Status } from "@/components/PageShell";
import { useDoc, STATUS } from "@/lib/content";
import { useLang } from "@/lib/LanguageContext";

function Detail() {
  const id = useSearchParams().get("id");
  const { data: p, loading, error } = useDoc("projects", id);
  const { lang } = useLang();

  if (!p) {
    return (
      <PageShell title={lang === "bn" ? "প্রকল্প" : "Project"}>
        <Status loading={loading} error={error} empty emptyText={lang === "bn" ? "প্রকল্পটি পাওয়া যায়নি।" : "Project not found."} />
        <Link href="/projects" className="text-emerald-700 underline">{lang === "bn" ? "← সব প্রকল্প" : "← All Projects"}</Link>
      </PageShell>
    );
  }

  return (
    <PageShell title={lang === "bn" ? p.titleBn : p.titleEn} subtitle={[p.category, STATUS[p.status], p.date].filter(Boolean).join(" · ")}>
      {p.image && <img src={p.image} alt={lang === "bn" ? p.titleBn : p.titleEn} className="mb-6 max-h-[28rem] w-full rounded-xl object-cover" />}
      <div className="whitespace-pre-line leading-8 text-gray-800">{lang === "bn" ? p.bodyBn : p.bodyEn}</div>
      <Link href="/projects" className="mt-8 inline-block text-emerald-700 underline">{lang === "bn" ? "← সব প্রকল্প" : "← All Projects"}</Link>
    </PageShell>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={null}>
      <Detail />
    </Suspense>
  );
}
