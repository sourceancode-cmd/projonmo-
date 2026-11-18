import PageShell from "@/components/PageShell";
import SimpleForm from "@/components/SimpleForm";
import { SITE } from "@/lib/site";

export const metadata = { title: `যোগাযোগ | ${SITE.name}` };

const FIELDS = [
  { name: "name", label: "আপনার নাম", required: true },
  { name: "phone", label: "মোবাইল নম্বর", type: "tel" },
  { name: "email", label: "ইমেইল", type: "email" },
  { name: "message", label: "আপনার বার্তা", type: "textarea", required: true },
];

export default function ContactPage() {
  return (
    <PageShell title="যোগাযোগ" subtitle="আপনার মতামত বা প্রশ্ন আমাদের জানান">
      <div className="grid gap-10 md:grid-cols-2">
        <ul className="space-y-3 text-gray-800">
          {SITE.address && <li><strong>ঠিকানা:</strong> {SITE.address}</li>}
          {SITE.phone && (
            <li><strong>ফোন:</strong> <a href={`tel:${SITE.phone}`}>{SITE.phone}</a></li>
          )}
          {SITE.email && (
            <li><strong>ইমেইল:</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          )}
        </ul>
        <SimpleForm target="messages" fields={FIELDS} button="বার্তা পাঠান" />
      </div>
    </PageShell>
  );
}
