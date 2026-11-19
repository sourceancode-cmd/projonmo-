"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthInstance } from "@/lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { logout } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, setDoc, getDocs, deleteDoc, getDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("gallery");
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async (tab) => {
    if (tab === "settings") {
      // সেটিংসের ডেটা লোড করা
      const docSnap = await getDoc(doc(db, "settings", "site"));
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
      setItems([]);
      return;
    }
    const snap = await getDocs(collection(db, tab));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setItems(data);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuthInstance(), (u) => {
      if (u) {
        setUser(u);
        fetchData(activeTab);
      } else {
        router.push("/admin/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, activeTab]);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let finalData = { ...formData };

    try {
      if (file) {
        setUploading(true);
        const formDataCloudinary = new FormData();
        formDataCloudinary.append("file", file);
        formDataCloudinary.append("upload_preset", "projonmo_upload"); 

        const res = await fetch("https://api.cloudinary.com/v1_1/jzocx6ib/image/upload", {
          method: "POST",
          body: formDataCloudinary,
        });
        
        const data = await res.json();
        
        if (data.secure_url) {
          if (activeTab === "settings") {
            finalData.leaderPhoto = data.secure_url;
          } else {
            finalData.image = data.secure_url;
          }
        } else {
          alert("ছবি আপলোড ব্যর্থ হয়েছে!");
          setSaving(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      if (finalData.order) finalData.order = parseInt(finalData.order);

      if (activeTab === "settings") {
        await setDoc(doc(db, "settings", "site"), finalData, { merge: true });
        alert("সেটিংস সফলভাবে আপডেট করা হয়েছে!");
      } else if (editId) {
        await setDoc(doc(db, activeTab, editId), finalData, { merge: true });
        alert("সফলভাবে আপডেট করা হয়েছে!");
      } else {
        await addDoc(collection(db, activeTab), finalData);
        alert("সফলভাবে যোগ করা হয়েছে!");
      }
      
      setFormData({});
      setFile(null);
      setEditId(null);
      fetchData(activeTab);
    } catch (err) {
      alert("সমস্যা হয়েছে: " + err.message);
    }
    setSaving(false);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setFile(null);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (confirm("আপনি কি নিশ্চিত এই আইটেমটি মুছে ফেলতে চান?")) {
      await deleteDoc(doc(db, activeTab, id));
      alert("মুছে ফেলা হয়েছে!");
      fetchData(activeTab);
    }
  };

  if (loading) return <div className="p-10 text-center">লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-800">অ্যাডমিন প্যানেল</h1>
          <button onClick={handleLogout} className="rounded bg-red-600 px-4 py-2 text-white">লগআউট</button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b pb-2">
          {["gallery", "sliders", "projects", "team", "settings"].map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setFormData({}); setEditId(null); setFile(null); }} 
              className={`px-4 py-2 rounded ${activeTab === tab ? "bg-emerald-700 text-white" : "bg-gray-200"}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <form onSubmit={handleSave} className="space-y-4 rounded-xl bg-white p-6 shadow h-fit">
            <h2 className="text-lg font-semibold mb-4">{activeTab === "settings" ? "সেটিংস আপডেট করুন" : (editId ? "এডিট করুন" : `নতুন ${activeTab} যোগ করুন`)}</h2>
            
            {activeTab !== "settings" && (
              <label className="block">
                <span className="text-sm font-medium">ছবি আপলোড করুন (ঐচ্ছিক)</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 w-full rounded border p-2 bg-gray-50" />
                {(formData.image) && !file && <p className="text-xs text-gray-500 mt-1">বর্তমান ছবি: {formData.image.substring(0, 30)}...</p>}
                {file && <p className="text-xs text-emerald-600 mt-1">নতুন ছবি সিলেক্ট করা হয়েছে: {file.name}</p>}
              </label>
            )}

            {activeTab === "settings" && (
              <label className="block">
                <span className="text-sm font-medium">নির্বাহী পরিচালকের ছবি আপলোড করুন (ঐচ্ছিক)</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 w-full rounded border p-2 bg-gray-50" />
                {(formData.leaderPhoto) && !file && <p className="text-xs text-gray-500 mt-1">বর্তমান ছবি: {formData.leaderPhoto.substring(0, 30)}...</p>}
              </label>
            )}

            {activeTab === "sliders" && (
              <>
                <label className="block">
                  <span className="text-sm font-medium">টাইটেল (Title) *</span>
                  <input type="text" name="title" required className="mt-1 w-full rounded border p-2" value={formData.title || ""} onChange={handleChange} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">সাবটাইটেল (Subtitle)</span>
                  <input type="text" name="subtitle" className="mt-1 w-full rounded border p-2" value={formData.subtitle || ""} onChange={handleChange} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">বাটন টেক্সট (Button)</span>
                  <input type="text" name="button" className="mt-1 w-full rounded border p-2" value={formData.button || ""} onChange={handleChange} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">লিংক (Link)</span>
                  <input type="text" name="link" className="mt-1 w-full rounded border p-2" value={formData.link || ""} onChange={handleChange} />
                </label>
              </>
            )}

            {activeTab === "gallery" && (
              <>
                <label className="block">
                  <span className="text-sm font-medium">ক্যাপশন (Caption)</span>
                  <input type="text" name="caption" className="mt-1 w-full rounded border p-2" value={formData.caption || ""} onChange={handleChange} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">ক্যাটাগরি (Category)</span>
                  <input type="text" name="category" className="mt-1 w-full rounded border p-2" value={formData.category || ""} onChange={handleChange} />
                </label>
              </>
            )}

            {activeTab === "projects" && (
              <>
                <label className="block">
                  <span className="text-sm font-medium">টাইটেল (Title) *</span>
                  <input type="text" name="title" required className="mt-1 w-full rounded border p-2" value={formData.title || ""} onChange={handleChange} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">সারসংক্ষেপ (Summary)</span>
                  <input type="text" name="summary" className="mt-1 w-full rounded border p-2" value={formData.summary || ""} onChange={handleChange} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">বিস্তারিত (Body)</span>
                  <textarea name="body" rows="4" className="mt-1 w-full rounded border p-2" value={formData.body || ""} onChange={handleChange} />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium">ক্যাটাগরি</span>
                    <input type="text" name="category" className="mt-1 w-full rounded border p-2" value={formData.category || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">স্ট্যাটাস</span>
                    <select name="status" className="mt-1 w-full rounded border p-2" value={formData.status || "ongoing"} onChange={handleChange}>
                      <option value="ongoing">চলমান</option>
                      <option value="upcoming">আসন্ন</option>
                      <option value="completed">সম্পন্ন</option>
                    </select>
                  </label>
                </div>
              </>
            )}

            {activeTab === "team" && (
              <>
                <label className="block">
                  <span className="text-sm font-medium">নাম (Name) *</span>
                  <input type="text" name="name" required className="mt-1 w-full rounded border p-2" value={formData.name || ""} onChange={handleChange} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">পদবি (Role)</span>
                  <input type="text" name="role" className="mt-1 w-full rounded border p-2" value={formData.role || ""} onChange={handleChange} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">ধরন (Type)</span>
                  <select name="type" className="mt-1 w-full rounded border p-2" value={formData.type || "committee"} onChange={handleChange}>
                    <option value="committee">কার্যনির্বাহী</option>
                    <option value="advisor">উপদেষ্টা</option>
                  </select>
                </label>
              </>
            )}

            {activeTab === "settings" && (
              <>
                <label className="block">
                  <span className="text-sm font-medium">নির্বাহী পরিচালকের নাম</span>
                  <input type="text" name="leaderName" className="mt-1 w-full rounded border p-2" value={formData.leaderName || ""} onChange={handleChange} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">নির্বাহী পরিচালকের পদবি</span>
                  <input type="text" name="leaderRole" className="mt-1 w-full rounded border p-2" value={formData.leaderRole || ""} onChange={handleChange} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">নির্বাহী পরিচালকের বাণী</span>
                  <textarea name="leaderMessage" rows="5" className="mt-1 w-full rounded border p-2" value={formData.leaderMessage || ""} onChange={handleChange} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">অনুদানের তথ্য</span>
                  <textarea name="donateInfo" rows="3" className="mt-1 w-full rounded border p-2" value={formData.donateInfo || ""} onChange={handleChange} />
                </label>
              </>
            )}

            {activeTab !== "settings" && (
              <label className="block">
                <span className="text-sm font-medium">ক্রম (Order)</span>
                <input type="number" name="order" className="mt-1 w-full rounded border p-2" value={formData.order || ""} onChange={handleChange} />
              </label>
            )}

            <div className="flex gap-2">
              <button type="submit" disabled={saving || uploading} className="rounded bg-emerald-700 px-6 py-2 text-white font-semibold hover:bg-emerald-800 disabled:opacity-50">
                {uploading ? "ছবি আপলোড হচ্ছে..." : saving ? "সেভ হচ্ছে..." : (editId ? "আপডেট করুন" : "সেভ করুন")}
              </button>
              {editId && (
                <button type="button" onClick={() => {setEditId(null); setFormData({}); setFile(null);}} className="rounded bg-gray-400 px-4 py-2 text-white">
                  বাতিল
                </button>
              )}
            </div>
          </form>

          {activeTab !== "settings" && (
            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-lg font-semibold mb-4">বর্তমান {activeTab} লিস্ট</h2>
              {items.length === 0 ? <p className="text-gray-500">কোনো ডেটা নেই।</p> : (
                <ul className="space-y-3">
                  {items.map(item => (
                    <li key={item.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-semibold">{item.title || item.caption || item.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="text-sm bg-blue-500 text-white px-2 py-1 rounded">এডিট</button>
                        <button onClick={() => handleDelete(item.id)} className="text-sm bg-red-500 text-white px-2 py-1 rounded">ডিলিট</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
