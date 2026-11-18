"use client";
import PageShell, { Status } from "@/components/PageShell";
import { useList } from "@/lib/content";

const GROUPS = [
  { type: "committee", title: "কার্যনির্বাহী পরিষদ" },
  { type: "advisor", title: "উপদেষ্টা পরিষদ" },
];

export default function TeamPage() {
  const { items, loading, error } = useList("team");

  return (
    <PageShell title="আমাদের পরিবার" subtitle="কার্যনির্বাহী ও উপদেষ্টা পরিষদ">
      <Status loading={loading} error={error} empty={!items.length} />
      {GROUPS.map((g) => {
        const people = items.filter((m) => m.type === g.type);
        if (!people.length) return null;
        return (
          <section key={g.type} className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">{g.title}</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {people.map((m) => (
                <div key={m.id} className="text-center">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      loading="lazy"
                      className="mx-auto h-32 w-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mx-auto h-32 w-32 rounded-full bg-gray-200" />
                  )}
                  <h3 className="mt-3 font-semibold">{m.name}</h3>
                  <p className="text-sm text-gray-600">{m.role}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </PageShell>
  );
}
