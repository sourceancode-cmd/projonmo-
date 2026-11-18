export default function PageShell({ title, subtitle, children }) {
  return (
    <main>
      <section className="bg-emerald-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-emerald-100">{subtitle}</p>}
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
    </main>
  );
}

export function Status({ loading, error, empty, emptyText = "এখনো কিছু যোগ করা হয়নি।" }) {
  const text = loading
    ? "লোড হচ্ছে..."
    : error
    ? "তথ্য আনা যায়নি। একটু পরে আবার চেষ্টা করুন।"
    : empty
    ? emptyText
    : null;
  return text ? <p className="py-10 text-center text-gray-500">{text}</p> : null;
}
