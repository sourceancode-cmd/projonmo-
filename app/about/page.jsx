import PageShell from "@/components/PageShell";
import { SITE } from "@/lib/site";

export const metadata = { title: `পরিচিতি | ${SITE.name}` };

export default function AboutPage() {
  return (
    <PageShell title="আমাদের পরিচিতি" subtitle={SITE.tagline}>
      <div className="whitespace-pre-line leading-8 text-gray-800">
        {SITE.about || SITE.description}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {SITE.mission && (
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-bold text-emerald-800">আমাদের মিশন</h2>
            <p className="mt-2 leading-8 text-gray-700">{SITE.mission}</p>
          </div>
        )}
        {SITE.vision && (
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-bold text-emerald-800">আমাদের ভিশন</h2>
            <p className="mt-2 leading-8 text-gray-700">{SITE.vision}</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
