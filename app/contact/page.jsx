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
        <div className="space-y-6">
          <ul className="space-y-3 text-gray-800">
            {SITE.address && <li><strong>ঠিকানা:</strong> {SITE.address}</li>}
            {SITE.phone && (
              <li><strong>ফোন:</strong> <a href={`tel:${SITE.phone}`}>{SITE.phone}</a></li>
            )}
            {SITE.email && (
              <li><strong>ইমেইল:</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            )}
          </ul>

          {/* গুগল ম্যাপ যোগ করা হলো */}
          <div className="h-64 w-full overflow-hidden rounded-xl border shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14580.999999999998!2d90.2734!3d23.9333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDU2JzAwLjAiTiA5MMKwMTYnMjQuMiJF!5e0!3m2!1sen!2sbd!4v1600000000000!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Projonmo Location"
            ></iframe>
          </div>
        </div>

        <SimpleForm target="messages" fields={FIELDS} button="বার্তা পাঠান" />
      </div>
    </PageShell>
  );
}
