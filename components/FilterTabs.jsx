export default function FilterTabs({ options, value, onChange }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-full border px-4 py-1.5 text-sm ${
            value === o.value
              ? "border-emerald-700 bg-emerald-700 text-white"
              : "border-gray-300 text-gray-700 hover:border-emerald-700"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
