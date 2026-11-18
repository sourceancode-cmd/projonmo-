"use client";
import PageShell from "@/components/PageShell";
import SimpleForm from "@/components/SimpleForm";
import { SITE } from "@/lib/site";
import { useLang } from "@/lib/LanguageContext";

const FIELDS = [
  { name: "name", label: {bn: "আপনার নাম", en: "Your Name"}, required: true },
  { name: "phone", label: {bn: "মোবাইল নম্বর", en: "Mobile Number"}, type: "tel" },
  { name: "email", label: {bn: "ইমেইল", en: "Email"}, type: "email" },
  { name: "message", label: {bn: "আপনার বার্তা", en: "Your Message"}, type: "textarea", required: true },
];

export default function ContactPage() {
  const { lang } = useLang();
  const translatedFields = FIELDS.map(f => ({...f, label: f.label[lang]}));

  return (
    <PageShell title={lang === "bn" ? "যোগাযোগ" : "Contact Us"} subtitle={lang === "bn" ? "আপনার মতামত বা প্রশ্ন আমাদের জানান" : "Share your thoughts or questions with us"}>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <ul className="space-y-3 text-gray-800">
            <li><strong>{lang === "bn" ? "ঠিকানা" : "Address"}:</strong> {SITE.address[lang]}</li>
            <li><strong>{lang === "bn" ? "ফোন" : "Phone"}:</strong> <a href={`tel:${SITE.phone}`}>{SITE.phone}</a></li>
            <li><strong>{lang === "bn" ? "ইমেইল" : "Email"}:</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          </ul>
          <div className="h-64 w-full overflow-hidden rounded-xl border shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14580.999999999998!2d90.2734!3d23.9333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDU2JzAwLjAiTiA5MMKwMTYnMjQuMiJF!5e0!3m2!1sen!2sbd!4v1600000000000!5m2!1sen!2sbd"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Location"
            ></iframe>
          </div>
        </div>
        <SimpleForm target="messages" fields={translatedFields} button={lang === "bn" ? "বার্তা পাঠান" : "Send Message"} />
      </div>
    </PageShell>
  );
}
