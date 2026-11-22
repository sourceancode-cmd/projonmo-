"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ABOUT, NAV } from "@/lib/site";
import { useLang } from "@/lib/LanguageContext";
import { useDoc } from "@/lib/content";

export default function Footer() {
  const { lang } = useLang();
  const pathname = usePathname();
  const { data: s } = useDoc("settings", "site");

  if (pathname?.startsWith("/admin")) return null;

  const siteName = s?.siteName || (lang === "bn" ? "প্রজন্ম যুব উন্নয়ন সংস্থা" : "Projonmo Jubo Unnoyn Songstha");
  const tagline = s?.tagline || (lang === "bn" ? "বিশ্বাস · নিরাপত্তা · নিশ্চয়তা" : "Trust · Security · Certainty");

  return (
    <footer className="mt-16 bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">{siteName}</p>
          <p className="mt-2 text-sm">{tagline}</p>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">{lang === "bn" ? "লিংক" : "Links"}</p>
          <ul className="space-y-2 text-sm">
            {[...ABOUT, ...NAV].map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label[lang]}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">{lang === "bn" ? "যোগাযোগ" : "Contact"}</p>
          <ul className="space-y-2 text-sm">
            {s?.address && <li>{s.address}</li>}
            {s?.phone && <li><a href={`tel:${s.phone}`}>{s.phone}</a></li>}
            {s?.email && <li><a href={`mailto:${s.email}`}>{s.email}</a></li>}
            {s?.facebook && <li><a href={s.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs">
        © {new Date().getFullYear()} {siteName}
      </div>
    </footer>
  );
}
