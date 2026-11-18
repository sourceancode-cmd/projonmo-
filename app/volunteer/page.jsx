import PageShell from "@/components/PageShell";
import SimpleForm from "@/components/SimpleForm";
import { SITE } from "@/lib/site";

export const metadata = { title: `স্বেচ্ছাসেবক হোন | ${SITE.name}` };

const FIELDS = [
  { name: "name", label: "আপনার নাম", required: true },
  { name: "phone", label: "মোবাইল নম্বর", type: "tel", required: true },
  { name: "email", label: "ইমেইল", type: "email" },
  { name: "address", label: "ঠিকানা" },
  { name: "interest", label: "কোন কাজে আগ্রহী" },
  { name: "message", label: "নিজের সম্পর্কে কিছু লিখুন", type: "textarea" },
];

export default function VolunteerPage() {
  return (
    <PageShell title="স্বেচ্ছাসেবক হোন" subtitle="আপনার সময় ও দক্ষতা দিয়ে আমাদের সাথে যুক্ত হোন">
      <div className="mx-auto max-w-xl">
        <SimpleForm target="volunteers" fields={FIELDS} button="নিবন্ধন করুন" />
      </div>
    </PageShell>
  );
}
