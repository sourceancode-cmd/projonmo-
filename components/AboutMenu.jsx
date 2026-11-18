"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ABOUT as LINKS } from "@/lib/site";
import { useLang } from "@/lib/LanguageContext";

export default function AboutMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { lang } = useLang();

  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1"
      >
        {lang === "bn" ? "আমাদের সম্পর্কে" : "About Us"} <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-lg border bg-white py-2 shadow-lg">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-800 hover:bg-emerald-50"
            >
              {l.label[lang]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
