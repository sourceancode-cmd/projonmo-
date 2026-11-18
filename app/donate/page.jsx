"use client";
import PageShell, { Status } from "@/components/PageShell";
import { useDoc } from "@/lib/content";
import { useLang } from "@/lib/LanguageContext";

export default function DonatePage() {
  const { data: s, loading, error } = useDoc("settings", "site");
  const { lang } = useLang();

  return (
    <PageShell title={lang === "bn" ? "অনুদান দিন" : "Donate"} subtitle={lang === "bn" ? "আপনার সহায়তায় আমাদের কাজ এগিয়ে যায়" : "Your support helps our work move forward"}>
      <Status loading={loading} error={error} empty={!s?.donateInfo} emptyText={lang === "bn" ? "অনুদানের তথ্য শিগগিরই যোগ করা হবে।" : "Donation information will be added soon."} />
      {s?.donateInfo && (
        <div className="mx-auto max-w-xl whitespace-pre-line rounded-xl border p-6 leading-8">
          {s.donateInfo}
        </div>
      )}
    </PageShell>
  );
}
