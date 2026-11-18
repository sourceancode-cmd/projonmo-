"use client";
import { useState } from "react";
import { submit } from "@/lib/content";

const cls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-700 focus:outline-none";

export default function SimpleForm({ target, fields, button = "জমা দিন" }) {
  const [values, setValues] = useState({});
  const [state, setState] = useState("idle");

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  async function onSubmit(e) {
    e.preventDefault();
    setState("sending");
    try {
      await submit(target, values);
      setValues({});
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="rounded-lg bg-emerald-50 p-4 text-emerald-800">
        ধন্যবাদ! আপনার তথ্য জমা হয়েছে। আমরা শিগগিরই যোগাযোগ করব।
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((f) => (
        <label key={f.name} className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            {f.label}{f.required && " *"}
          </span>
          {f.type === "textarea" ? (
            <textarea
              rows={4}
              maxLength={1000}
              required={f.required}
              className={cls}
              value={values[f.name] || ""}
              onChange={(e) => set(f.name, e.target.value)}
            />
          ) : (
            <input
              type={f.type || "text"}
              maxLength={200}
              required={f.required}
              className={cls}
              value={values[f.name] || ""}
              onChange={(e) => set(f.name, e.target.value)}
            />
          )}
        </label>
      ))}
      {state === "error" && (
        <p className="text-sm text-red-600">জমা দেওয়া যায়নি। আবার চেষ্টা করুন।</p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-full bg-emerald-700 px-6 py-2.5 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
      >
        {state === "sending" ? "পাঠানো হচ্ছে..." : button}
      </button>
    </form>
  );
}
