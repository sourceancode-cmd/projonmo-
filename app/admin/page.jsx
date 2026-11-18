"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthInstance } from "@/lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { logout } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("gallery");
  const router = useRouter();
  const [formData, setFormData] = useState({});

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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, activeTab), formData);
      alert("সফলভাবে যোগ করা হয়েছে!");
      setFormData({});
    } catch (err) {
      alert("সমস্যা হয়েছে: " + err.message);
    }
  };

  if (loading) return <div className="p-10 text-center">লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-800">অ্যাডমিন প্যানেল</h1>
          <button onClick={handleLogout} className="rounded bg-red-600 px-4 py-2 text-white">লগআউট</button>
        </div>

        <div className="mb-6 flex gap-2 border-b pb-2">
          {["gallery", "sliders", "projects", "team"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} 
              className={`px-4 py-2 rounded ${activeTab === tab ? "bg-emerald-700 text-white" : "bg-gray-200"}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-4 rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">নতুন {activeTab} যোগ করুন</h2>
          
          <label className="block">
            <span className="text-sm font-medium">ছবির লিংক (Image URL)</span>
            <input type="text" className="mt-1 w-full rounded border p-2" required
              value={formData.image || ""} onChange={(e) => setFormData({...formData, image: e.target.value})} />
          </label>

          {activeTab !== "gallery" && (
             <label className="block">
             <span className="text-sm font-medium">টাইটেল (Title)</span>
             <input type="text" className="mt-1 w-full rounded border p-2" required
               value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} />
           </label>
          )}

          {activeTab === "gallery" && (
             <label className="block">
             <span className="text-sm font-medium">ক্যাপশন (Caption)</span>
             <input type="text" className="mt-1 w-full rounded border p-2" 
               value={formData.caption || ""} onChange={(e) => setFormData({...formData, caption: e.target.value})} />
           </label>
          )}

           <label className="block">
            <span className="text-sm font-medium">ক্রম (Order - সংখ্যা)</span>
            <input type="number" className="mt-1 w-full rounded border p-2" 
              value={formData.order || ""} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} />
          </label>

          <button type="submit" className="rounded bg-emerald-700 px-6 py-2 text-white font-semibold hover:bg-emerald-800">
            সেভ করুন
          </button>
        </form>
      </div>
    </div>
  );
}
