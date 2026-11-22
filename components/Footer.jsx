"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, ABOUT, NAV } from "@/lib/site";
import { useLang } from "@/lib/LanguageContext";
import { useDoc } from "@/lib/content";

export default function Footer() {
  const { lang } = useLang();
  const pathname = usePathname();
  const { data: s } = useDoc("settings", "site");

  // অ্যাডমিন প্যানেলে ফুটার দেখাবে না
  if (pathname?.startsWith("/admin")) return null;

  // ফায়ারবেস থেকে ডেটা না এলে ডিফল্ট মান দেখাবে
  const siteName = lang === "bn" 
    ? (s?.siteNameBn || SITE.name.bn) 
    : (s?.siteNameEn || SITE.name.en);
    
  const tagline = lang === "bn" 
    ? (s?.taglineBn || SITE.tagline.bn) 
    : (s?.taglineEn || SITE.tagline.en);

  const address = lang === "bn" 
    ? (s?.addressBn || SITE.address.bn) 
    : (s?.addressEn || SITE.address.en);

  const phone = s?.phone || SITE.phone;
  const email = s?.email || SITE.email;
  const facebook = s?.facebook || SITE.facebook;

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
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">{l.label[lang]}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">{lang === "bn" ? "যোগাযোগ" : "Contact"}</p>
          <ul className="space-y-2 text-sm">
            {address && <li>{address}</li>}
            {phone && <li><a href={`tel:${phone}`}>{phone}</a></li>}
            {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
            {facebook && (
              <li><a href={facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs">
        © {new Date().getFullYear()} {siteName}
      </div>
    </footer>
  );
}
