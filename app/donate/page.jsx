"use client";
import PageShell, { Status } from "@/components/PageShell";
import { useDoc } from "@/lib/content";

export default function DonatePage() {
  const { data: s, loading, error } = useDoc("settings", "site");

  return (
    <PageShell title="অনুদান দিন" subtitle="আপনার সহায়তায় আমাদের কাজ এগিয়ে যায়">
      <Status
        loading={loading}
        error={error}
        empty={!s?.donateInfo}
        emptyText="অনুদানের তথ্য শিগগিরই যোগ করা হবে।"
      />
      {s?.donateInfo && (
        <div className="mx-auto max-w-xl whitespace-pre-line rounded-xl border p-6 leading-8">
          {s.donateInfo}
        </div>
      )}
    </PageShell>
  );
}
