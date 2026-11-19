"use client";
import PageShell, { Status } from "@/components/PageShell";
import { useDoc } from "@/lib/content";
import { useLang } from "@/lib/LanguageContext";

export default function MessagePage() {
  const { data: s, loading, error } = useDoc("settings", "site");
  const { lang } = useLang();

  return (
    <PageShell title={lang === "bn" ? "নির্বাহী পরিচালকের বাণী" : "Message from Executive Director"}>
      <Status loading={loading} error={error} empty={!s?.leaderMessage} />
      {s?.leaderMessage && (
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <div className="text-center">
            {s.leaderPhoto && (
              <img src={s.leaderPhoto} alt={s.leaderName || ""} className="mx-auto w-48 rounded-xl" />
            )}
            <p className="mt-3 font-semibold">{s.leaderName}</p>
            <p className="text-sm text-gray-600">{s.leaderRole}</p>
          </div>
          <div className="whitespace-pre-line leading-8 text-gray-800">{s.leaderMessage}</div>
        </div>
      )}
    </PageShell>
  );
}
