"use client";
import { useState } from "react";
import Link from "next/link";
import AboutMenu from "@/components/AboutMenu";
import { SITE, ABOUT, NAV } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      {(SITE.address || SITE.phone) && (
        <div className="bg-emerald-900 text-xs text-emerald-50">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-x-4 px-4 py-1.5">
            <span>{SITE.address}</span>
            {SITE.phone && <a href={`tel:${SITE.phone}`}>{SITE.phone}</a>}
          </div>
        </div>
      )}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-emerald-800">
          {SITE.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          <Link href="/">হোম</Link>
          <AboutMenu />
          {NAV.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
          <Link
            href="/donate"
            className="rounded-full bg-emerald-700 px-5 py-2 text-white hover:bg-emerald-800"
          >
            অনুদান দিন
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
          {[{ href: "/", label: "হোম" }, ...ABOUT, ...NAV, { href: "/donate", label: "অনুদান দিন" }].map(
            (l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-medium"
              >
                {l.label}
              </Link>
            )
          )}
        </nav>
      )}
    </header>
  );
}
