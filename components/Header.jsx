"use client";
import { useState } from "react";
import Link from "next/link";
import AboutMenu from "@/components/AboutMenu";
import { SITE, ABOUT, NAV } from "@/lib/site";
import { useLang } from "@/lib/LanguageContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { lang, toggleLang } = useLang();

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      {(SITE.address[lang] || SITE.phone) && (
        <div className="bg-emerald-900 text-xs text-emerald-50">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-x-4 px-4 py-1.5">
            <span>{SITE.address[lang]}</span>
            {SITE.phone && <a href={`tel:${SITE.phone}`}>{SITE.phone}</a>}
          </div>
        </div>
      )}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-emerald-800">
          <img 
            src="https://pub-d943faf66c4d438c867600d375c5676e.r2.dev/projonmo%20image/01_logo_500x500_HQ.webp" 
            alt="Projonmo Logo" 
            className="h-10 w-auto" 
          />
          <span>{SITE.name[lang]}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          <Link href="/">{lang === "bn" ? "হোম" : "Home"}</Link>
          <AboutMenu />
          {NAV.map((l) => (
            <Link key={l.href} href={l.href}>{l.label[lang]}</Link>
          ))}
          
          {/* ভাষা পরিবর্তনের বাটন */}
          <button 
            onClick={toggleLang}
            className="rounded-full border border-emerald-700 px-3 py-1 text-emerald-800 hover:bg-emerald-50 font-bold"
          >
            {lang === "bn" ? "English" : "বাংলা"}
          </button>

          <Link
            href="/donate"
            className="rounded-full bg-emerald-700 px-5 py-2 text-white hover:bg-emerald-800"
          >
            {lang === "bn" ? "অনুদান দিন" : "Donate"}
          </Link>
        </nav>
        <button
          type="button"
          aria-label="মেনু"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg border px-3 py-1.5 text-xl lg:hidden"
        >
          ☰
        </button>
      </div>
      {open && (
        <nav className="border-t px-4 py-3 lg:hidden">
          {[{ href: "/", label: { bn: "হোম", en: "Home" } }, ...ABOUT, ...NAV, { href: "/donate", label: { bn: "অনুদান দিন", en: "Donate" } }].map(
            (l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-medium"
              >
                {l.label[lang]}
              </Link>
            )
          )}
          <button onClick={toggleLang} className="mt-2 block py-2 text-sm font-bold text-emerald-700">
            {lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
          </button>
        </nav>
      )}
    </header>
  );
}
