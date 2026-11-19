"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthInstance } from "@/lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { logout } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("gallery");
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuthInstance(), (u) => {
      if (u) {
        setUser(u);
      } else {
        router.push("/admin/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSave = { ...formData };
      if (dataToSave.order) dataToSave.order = parseInt(dataToSave.order);
      
      if (activeTab === "settings") {
        // সেটিংস আপডেট করার জন্য (নতুন ডকুমেন্ট না বানিয়ে আগেরটা আপডেট করবে)
        await setDoc(doc(db, "settings", "site"), dataToSave, { merge: true });
        alert("সেটিংস সফলভাবে আপডেট করা হয়েছে!");
      } else {
        await addDoc(collection(db, activeTab), dataToSave);
        alert("সফলভাবে যোগ করা হয়েছে!");
      }
      setFormData({});
    } catch (err) {
      alert("সমস্যা হয়েছে: " + err.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center">লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-800">অ্যাডমিন প্যানেল</h1>
          <button onClick={handleLogout} className="rounded bg-red-600 px-4 py-2 text-white">লগআউট</button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b pb-2">
          {["gallery", "sliders", "projects", "team", "settings"].map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setFormData({}); }} 
              className={`px-4 py-2 rounded ${activeTab === tab ? "bg-emerald-700 text-white" : "bg-gray-200"}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-4 rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">নতুন {activeTab} যোগ করুন</h2>
          
          {activeTab !== "settings" && (
            <label className="block">
              <span className="text-sm font-medium">ছবির লিংক (Image URL) *</span>
              <input type="text" name="image" required className="mt-1 w-full rounded border p-2"
                value={formData.image || ""} onChange={handleChange} />
            </label>
          )}

          {activeTab === "sliders" && (
            <>
              <label className="block">
                <span className="text-sm font-medium">টাইটেল (Title) *</span>
                <input type="text" name="title" required className="mt-1 w-full rounded border p-2"
                  value={formData.title || ""} onChange={handleChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">সাবটাইটেল (Subtitle)</span>
                <input type="text" name="subtitle" className="mt-1 w-full rounded border p-2"
                  value={formData.subtitle || ""} onChange={handleChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">বাটন টেক্সট (Button)</span>
                <input type="text" name="button" className="mt-1 w-full rounded border p-2"
                  value={formData.button || ""} onChange={handleChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">লিংক (Link)</span>
                <input type="text" name="link" className="mt-1 w-full rounded border p-2"
                  value={formData.link || ""} onChange={handleChange} />
              </label>
            </>
          )}

          {activeTab === "gallery" && (
            <>
              <label className="block">
                <span className="text-sm font-medium">ক্যাপশন (Caption)</span>
                <input type="text" name="caption" className="mt-1 w-full rounded border p-2"
                  value={formData.caption || ""} onChange={handleChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">ক্যাটাগরি (Category)</span>
                <input type="text" name="category" className="mt-1 w-full rounded border p-2"
                  value={formData.category || ""} onChange={handleChange} />
              </label>
            </>
          )}

          {activeTab === "projects" && (
            <>
              <label className="block">
                <span className="text-sm font-medium">টাইটেল (Title) *</span>
                <input type="text" name="title" required className="mt-1 w-full rounded border p-2"
                  value={formData.title || ""} onChange={handleChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">সারসংক্ষেপ (Summary)</span>
                <input type="text" name="summary" className="mt-1 w-full rounded border p-2"
                  value={formData.summary || ""} onChange={handleChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">বিস্তারিত (Body)</span>
                <textarea name="body" rows="4" className="mt-1 w-full rounded border p-2"
                  value={formData.body || ""} onChange={handleChange} />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium">ক্যাটাগরি (Category)</span>
                  <input type="text" name="category" className="mt-1 w-full rounded border p-2"
                    value={formData.category || ""} onChange={handleChange} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">স্ট্যাটাস</span>
                  <select name="status" className="mt-1 w-full rounded border p-2"
                    value={formData.status || "ongoing"} onChange={handleChange}>
                    <option value="ongoing">চলমান (Ongoing)</option>
                    <option value="upcoming">আসন্ন (Upcoming)</option>
                    <option value="completed">সম্পন্ন (Completed)</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium">তারিখ (Date)</span>
                <input type="text" name="date" placeholder="যেমন: ২০২৪" className="mt-1 w-full rounded border p-2"
                  value={formData.date || ""} onChange={handleChange} />
              </label>
            </>
          )}

          {activeTab === "team" && (
            <>
              <label className="block">
                <span className="text-sm font-medium">নাম (Name) *</span>
                <input type="text" name="name" required className="mt-1 w-full rounded border p-2"
                  value={formData.name || ""} onChange={handleChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">পদবি (Role)</span>
                <input type="text" name="role" className="mt-1 w-full rounded border p-2"
                  value={formData.role || ""} onChange={handleChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">ধরন (Type)</span>
                <select name="type" className="mt-1 w-full rounded border p-2"
                  value={formData.type || "committee"} onChange={handleChange}>
                  <option value="committee">কার্যনির্বাহী (Committee)</option>
                  <option value="advisor">উপদেষ্টা (Advisor)</option>
                </select>
              </label>
            </>
          )}

          {/* সেটিংসের জন্য নতুন ফিল্ড */}
          {activeTab === "settings" && (
            <>
              <label className="block">
                <span className="text-sm font-medium">সভাপতির নাম (Leader Name)</span>
                <input type="text" name="leaderName" className="mt-1 w-full rounded border p-2"
                  value={formData.leaderName || ""} onChange={handleChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">সভাপতির পদবি (Leader Role)</span>
                <input type="text" name="leaderRole" className="mt-1 w-full rounded border p-2"
                  value={formData.leaderRole || ""} onChange={handleChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">সভাপতির ছবির লিংক (Leader Photo URL)</span>
                <input type="text" name="leaderPhoto" className="mt-1 w-full rounded border p-2"
                  value={formData.leaderPhoto || ""} onChange={handleChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">সভাপতির বাণী (Leader Message)</span>
                <textarea name="leaderMessage" rows="5" className="mt-1 w-full rounded border p-2"
                  value={formData.leaderMessage || ""} onChange={handleChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">অনুদানের তথ্য (Donate Info - e.g. bKash Number)</span>
                <textarea name="donateInfo" rows="3" className="mt-1 w-full rounded border p-2"
                  value={formData.donateInfo || ""} onChange={handleChange} />
              </label>
            </>
          )}

          {activeTab !== "settings" && (
            <label className="block">
              <span className="text-sm font-medium">ক্রম (Order - সংখ্যা)</span>
              <input type="number" name="order" className="mt-1 w-full rounded border p-2"
                value={formData.order || ""} onChange={handleChange} />
            </label>
          )}

          <button type="submit" disabled={saving} className="rounded bg-emerald-700 px-6 py-2 text-white font-semibold hover:bg-emerald-800 disabled:opacity-50">
            {saving ? "সেভ হচ্ছে..." : (activeTab === "settings" ? "সেটিংস আপডেট করুন" : "সেভ করুন")}
          </button>
        </form>
      </div>
    </div>
  );
}
