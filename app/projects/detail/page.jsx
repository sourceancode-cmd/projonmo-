"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PageShell, { Status } from "@/components/PageShell";
import { useDoc, STATUS } from "@/lib/content";

function Detail() {
  const id = useSearchParams().get("id");
  const { data: p, loading, error } = useDoc("projects", id);

  if (!p) {
    return (
      <PageShell title="প্রকল্প">
        <Status loading={loading} error={error} empty emptyText="প্রকল্পটি পাওয়া যায়নি।" />
        <Link href="/projects" className="text-emerald-700 underline">← সব প্রকল্প</Link>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={p.title}
      subtitle={[p.category, STATUS[p.status], p.date].filter(Boolean).join(" · ")}
    >
      {p.image && (
        <img src={p.image} alt={p.title} className="mb-6 max-h-[28rem] w-full rounded-xl object-cover" />
      )}
      <div className="whitespace-pre-line leading-8 text-gray-800">{p.body || p.summary}</div>
      <Link href="/projects" className="mt-8 inline-block text-emerald-700 underline">
        ← সব প্রকল্প
      </Link>
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
