"use client";
import Link from "next/link";
import { SITE, ABOUT, NAV } from "@/lib/site";
import { useLang } from "@/lib/LanguageContext";

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="mt-16 bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">{SITE.name[lang]}</p>
          <p className="mt-2 text-sm">{SITE.tagline[lang]}</p>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">{lang === "bn" ? "লিংক" : "Links"}</p>
          <ul className="space-y-2 text-sm">
            {[...ABOUT, ...NAV].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">{l.label[lang]}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">{lang === "bn" ? "যোগাযোগ" : "Contact"}</p>
          <ul className="space-y-2 text-sm">
            {SITE.address[lang] && <li>{SITE.address[lang]}</li>}
            {SITE.phone && <li><a href={`tel:${SITE.phone}`}>{SITE.phone}</a></li>}
            {SITE.email && <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>}
            {SITE.facebook && (
              <li><a href={SITE.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            )}
            {SITE.youtube && (
              <li><a href={SITE.youtube} target="_blank" rel="noopener noreferrer">YouTube</a></li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs">
        © {new Date().getFullYear()} {SITE.name[lang]}
      </div>
    </footer>
  );
}
