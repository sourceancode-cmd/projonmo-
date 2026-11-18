"use client";
import PageShell from "@/components/PageShell";
import SimpleForm from "@/components/SimpleForm";
import { useLang } from "@/lib/LanguageContext";

const FIELDS = [
  { name: "name", label: {bn: "আপনার নাম", en: "Your Name"}, required: true },
  { name: "phone", label: {bn: "মোবাইল নম্বর", en: "Mobile Number"}, type: "tel", required: true },
  { name: "email", label: {bn: "ইমেইল", en: "Email"}, type: "email" },
  { name: "address", label: {bn: "ঠিকানা", en: "Address"} },
  { name: "interest", label: {bn: "কোন কাজে আগ্রহী", en: "Area of Interest"} },
  { name: "message", label: {bn: "নিজের সম্পর্কে কিছু লিখুন", en: "Tell us about yourself"}, type: "textarea" },
];

export default function VolunteerPage() {
  const { lang } = useLang();
  const translatedFields = FIELDS.map(f => ({...f, label: f.label[lang]}));

  return (
    <PageShell title={lang === "bn" ? "স্বেচ্ছাসেবক হোন" : "Become a Volunteer"} subtitle={lang === "bn" ? "আপনার সময় ও দক্ষতা দিয়ে আমাদের সাথে যুক্ত হোন" : "Join us with your time and skills"}>
      <div className="mx-auto max-w-xl">
        <SimpleForm target="volunteers" fields={translatedFields} button={lang === "bn" ? "নিবন্ধন করুন" : "Register"} />
      </div>
    </PageShell>
  );
}
