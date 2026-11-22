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
  const [translating, setTranslating] = useState(false); // নতুন স্টেট

  const TABS = ["gallery", "sliders", "projects", "team", "work", "volunteers", "messages", "settings"];
  const READ_ONLY_TABS = ["volunteers", "messages"];

  // গুগল ট্রান্সলেট এর বদলে MyMemory API ব্যবহার করা হচ্ছে
  const translateText = async (text, setTargetField) => {
    if (!text) return;
    setTranslating(true);
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=bn|en`);
      const data = await res.json();
      if (data.responseData && data.responseData.translatedText) {
        setFormData(prev => ({ ...prev, [setTargetField]: data.responseData.translatedText }));
      } else {
        alert("অনুবাদ করা যায়নি, ম্যানুয়ালি লিখুন।");
      }
    } catch (err) {
      alert("অনুবাদ সার্ভারে সমস্যা হয়েছে।");
    }
    setTranslating(false);
  };

  const fetchData = async (tab) => {
    if (tab === "settings") {
      const docSnap = await getDoc(doc(db, "settings", "site"));
      if (docSnap.exists()) setFormData(docSnap.data());
      setItems([]);
      return;
    }
    const snap = await getDocs(collection(db, tab));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (tab === "volunteers" || tab === "messages") {
      data.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
    }
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
    if (e.target.files[0]) setFile(e.target.files[0]);
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
          if (activeTab === "settings") finalData.leaderPhoto = data.secure_url;
          else finalData.image = data.secure_url;
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

  const isReadOnly = READ_ONLY_TABS.includes(activeTab);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-800">অ্যাডমিন প্যানেল</h1>
          <button onClick={handleLogout} className="rounded bg-red-600 px-4 py-2 text-white">লগআউট</button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b pb-2">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setFormData({}); setEditId(null); setFile(null); }} 
              className={`px-4 py-2 rounded ${activeTab === tab ? "bg-emerald-700 text-white" : "bg-gray-200"}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {!isReadOnly && (
            <form onSubmit={handleSave} className="space-y-4 rounded-xl bg-white p-6 shadow h-fit">
              <h2 className="text-lg font-semibold mb-4">{activeTab === "settings" ? "সেটিংস আপডেট করুন" : (editId ? "এডিট করুন" : `নতুন ${activeTab} যোগ করুন`)}</h2>
              
              {activeTab !== "settings" && (
                <label className="block">
                  <span className="text-sm font-medium">ছবি আপলোড করুন (ঐচ্ছিক)</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 w-full rounded border p-2 bg-gray-50" />
                  {(formData.image) && !file && <p className="text-xs text-gray-500 mt-1">বর্তমান ছবি: {formData.image.substring(0, 30)}...</p>}
                  {file && <p className="text-xs text-emerald-600 mt-1">নতুন ছবি: {file.name}</p>}
                </label>
              )}

              {/* ============ SETTINGS SECTION ============ */}
              {activeTab === "settings" && (
                <>
                  <label className="block">
                    <span className="text-sm font-medium">সাইটের নাম (বাংলা)</span>
                    <input type="text" name="siteNameBn" className="mt-1 w-full rounded border p-2" value={formData.siteNameBn || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">সাইটের নাম (English)</span>
                    <div className="flex gap-2 mt-1">
                      <input type="text" name="siteNameEn" className="w-full rounded border p-2" value={formData.siteNameEn || ""} onChange={handleChange} />
                      <button type="button" onClick={() => translateText(formData.siteNameBn, "siteNameEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ট্যাগলাইন (বাংলা)</span>
                    <input type="text" name="taglineBn" className="mt-1 w-full rounded border p-2" value={formData.taglineBn || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ট্যাগলাইন (English)</span>
                    <div className="flex gap-2 mt-1">
                      <input type="text" name="taglineEn" className="w-full rounded border p-2" value={formData.taglineEn || ""} onChange={handleChange} />
                      <button type="button" onClick={() => translateText(formData.taglineBn, "taglineEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ঠিকানা (বাংলা)</span>
                    <input type="text" name="addressBn" className="mt-1 w-full rounded border p-2" value={formData.addressBn || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ঠিকানা (English)</span>
                    <div className="flex gap-2 mt-1">
                      <input type="text" name="addressEn" className="w-full rounded border p-2" value={formData.addressEn || ""} onChange={handleChange} />
                      <button type="button" onClick={() => translateText(formData.addressBn, "addressEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ফোন</span>
                    <input type="text" name="phone" className="mt-1 w-full rounded border p-2" value={formData.phone || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ইমেইল</span>
                    <input type="text" name="email" className="mt-1 w-full rounded border p-2" value={formData.email || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ফেসবুক লিংক</span>
                    <input type="text" name="facebook" className="mt-1 w-full rounded border p-2" value={formData.facebook || ""} onChange={handleChange} />
                  </label>
                  
                  <div className="border-t pt-4 mt-4">
                    <label className="block">
                      <span className="text-sm font-medium">মিশন (বাংলা)</span>
                      <textarea name="missionBn" rows="2" className="mt-1 w-full rounded border p-2" value={formData.missionBn || ""} onChange={handleChange} />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium">মিশন (English)</span>
                      <div className="flex gap-2 mt-1">
                        <textarea name="missionEn" rows="2" className="w-full rounded border p-2" value={formData.missionEn || ""} onChange={handleChange} />
                        <button type="button" onClick={() => translateText(formData.missionBn, "missionEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                      </div>
                    </label>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <label className="block">
                      <span className="text-sm font-medium">ভিশন (বাংলা)</span>
                      <textarea name="visionBn" rows="2" className="mt-1 w-full rounded border p-2" value={formData.visionBn || ""} onChange={handleChange} />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium">ভিশন (English)</span>
                      <div className="flex gap-2 mt-1">
                        <textarea name="visionEn" rows="2" className="w-full rounded border p-2" value={formData.visionEn || ""} onChange={handleChange} />
                        <button type="button" onClick={() => translateText(formData.visionBn, "visionEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                      </div>
                    </label>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <label className="block">
                      <span className="text-sm font-medium">নির্বাহী পরিচালকের ছবি আপলোড</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 w-full rounded border p-2 bg-gray-50" />
                      {(formData.leaderPhoto) && !file && <p className="text-xs text-gray-500 mt-1">বর্তমান ছবি: {formData.leaderPhoto.substring(0, 30)}...</p>}
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium">নির্বাহী পরিচালকের নাম</span>
                      <input type="text" name="leaderName" className="mt-1 w-full rounded border p-2" value={formData.leaderName || ""} onChange={handleChange} />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block">
                        <span className="text-sm font-medium">পদবি (বাংলা)</span>
                        <input type="text" name="leaderRoleBn" className="mt-1 w-full rounded border p-2" value={formData.leaderRoleBn || ""} onChange={handleChange} />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium">পদবি (English)</span>
                        <div className="flex gap-1 mt-1">
                          <input type="text" name="leaderRoleEn" className="w-full rounded border p-2" value={formData.leaderRoleEn || ""} onChange={handleChange} />
                          <button type="button" onClick={() => translateText(formData.leaderRoleBn, "leaderRoleEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                        </div>
                      </label>
                    </div>
                    <label className="block mt-2">
                      <span className="text-sm font-medium">বাণী (বাংলা)</span>
                      <textarea name="leaderMessageBn" rows="5" className="mt-1 w-full rounded border p-2" value={formData.leaderMessageBn || ""} onChange={handleChange} />
                    </label>
                    <label className="block mt-2">
                      <span className="text-sm font-medium">বাণী (English)</span>
                      <div className="flex gap-2 mt-1">
                        <textarea name="leaderMessageEn" rows="5" className="w-full rounded border p-2" value={formData.leaderMessageEn || ""} onChange={handleChange} />
                        <button type="button" onClick={() => translateText(formData.leaderMessageBn, "leaderMessageEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                      </div>
                    </label>
                  </div>
                  
                  <label className="block border-t pt-4 mt-4">
                    <span className="text-sm font-medium">অনুদানের তথ্য</span>
                    <textarea name="donateInfo" rows="3" className="mt-1 w-full rounded border p-2" value={formData.donateInfo || ""} onChange={handleChange} />
                  </label>
                </>
              )}

              {/* ============ WORK SECTION ============ */}
              {activeTab === "work" && (
                <>
                  <label className="block">
                    <span className="text-sm font-medium">কার্যক্রমের নাম (বাংলা) *</span>
                    <input type="text" name="titleBn" required className="mt-1 w-full rounded border p-2" value={formData.titleBn || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">কার্যক্রমের নাম (English)</span>
                    <div className="flex gap-2 mt-1">
                      <input type="text" name="titleEn" className="w-full rounded border p-2" value={formData.titleEn || ""} onChange={handleChange} />
                      <button type="button" onClick={() => translateText(formData.titleBn, "titleEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">বিবরণ (বাংলা)</span>
                    <textarea name="textBn" rows="3" className="mt-1 w-full rounded border p-2" value={formData.textBn || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">বিবরণ (English)</span>
                    <div className="flex gap-2 mt-1">
                      <textarea name="textEn" rows="3" className="w-full rounded border p-2" value={formData.textEn || ""} onChange={handleChange} />
                      <button type="button" onClick={() => translateText(formData.textBn, "textEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                    </div>
                  </label>
                </>
              )}

              {/* ============ SLIDERS SECTION ============ */}
              {activeTab === "sliders" && (
                <>
                  <label className="block">
                    <span className="text-sm font-medium">টাইটেল (বাংলা) *</span>
                    <input type="text" name="titleBn" required className="mt-1 w-full rounded border p-2" value={formData.titleBn || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">টাইটেল (English)</span>
                    <div className="flex gap-2 mt-1">
                      <input type="text" name="titleEn" className="w-full rounded border p-2" value={formData.titleEn || ""} onChange={handleChange} />
                      <button type="button" onClick={() => translateText(formData.titleBn, "titleEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">সাবটাইটেল (বাংলা)</span>
                    <input type="text" name="subtitleBn" className="mt-1 w-full rounded border p-2" value={formData.subtitleBn || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">সাবটাইটেল (English)</span>
                    <div className="flex gap-2 mt-1">
                      <input type="text" name="subtitleEn" className="w-full rounded border p-2" value={formData.subtitleEn || ""} onChange={handleChange} />
                      <button type="button" onClick={() => translateText(formData.subtitleBn, "subtitleEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">বাটন (বাংলা)</span>
                    <input type="text" name="buttonBn" className="mt-1 w-full rounded border p-2" value={formData.buttonBn || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">বাটন (English)</span>
                    <div className="flex gap-2 mt-1">
                      <input type="text" name="buttonEn" className="w-full rounded border p-2" value={formData.buttonEn || ""} onChange={handleChange} />
                      <button type="button" onClick={() => translateText(formData.buttonBn, "buttonEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                    </div>
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
                    <span className="text-sm font-medium">ক্যাপশন (বাংলা)</span>
                    <input type="text" name="captionBn" className="mt-1 w-full rounded border p-2" value={formData.captionBn || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ক্যাপশন (English)</span>
                    <div className="flex gap-2 mt-1">
                      <input type="text" name="captionEn" className="w-full rounded border p-2" value={formData.captionEn || ""} onChange={handleChange} />
                      <button type="button" onClick={() => translateText(formData.captionBn, "captionEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">ক্যাটাগরি</span>
                    <input type="text" name="category" className="mt-1 w-full rounded border p-2" value={formData.category || ""} onChange={handleChange} />
                  </label>
                </>
              )}

              {activeTab === "projects" && (
                <>
                  <label className="block">
                    <span className="text-sm font-medium">টাইটেল (বাংলা) *</span>
                    <input type="text" name="titleBn" required className="mt-1 w-full rounded border p-2" value={formData.titleBn || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">টাইটেল (English)</span>
                    <div className="flex gap-2 mt-1">
                      <input type="text" name="titleEn" className="w-full rounded border p-2" value={formData.titleEn || ""} onChange={handleChange} />
                      <button type="button" onClick={() => translateText(formData.titleBn, "titleEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">সারসংক্ষেপ (বাংলা)</span>
                    <input type="text" name="summaryBn" className="mt-1 w-full rounded border p-2" value={formData.summaryBn || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">সারসংক্ষেপ (English)</span>
                    <div className="flex gap-2 mt-1">
                      <input type="text" name="summaryEn" className="w-full rounded border p-2" value={formData.summaryEn || ""} onChange={handleChange} />
                      <button type="button" onClick={() => translateText(formData.summaryBn, "summaryEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">বিস্তারিত (বাংলা)</span>
                    <textarea name="bodyBn" rows="4" className="mt-1 w-full rounded border p-2" value={formData.bodyBn || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">বিস্তারিত (English)</span>
                    <div className="flex gap-2 mt-1">
                      <textarea name="bodyEn" rows="4" className="w-full rounded border p-2" value={formData.bodyEn || ""} onChange={handleChange} />
                      <button type="button" onClick={() => translateText(formData.bodyBn, "bodyEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                    </div>
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
                    <span className="text-sm font-medium">পদবি (বাংলা)</span>
                    <input type="text" name="roleBn" className="mt-1 w-full rounded border p-2" value={formData.roleBn || ""} onChange={handleChange} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">পদবি (English)</span>
                    <div className="flex gap-2 mt-1">
                      <input type="text" name="roleEn" className="w-full rounded border p-2" value={formData.roleEn || ""} onChange={handleChange} />
                      <button type="button" onClick={() => translateText(formData.roleBn, "roleEn")} className="bg-blue-500 text-white px-2 rounded text-sm disabled:opacity-50" disabled={translating}>AUTO</button>
                    </div>
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

              {activeTab !== "settings" && (
                <label className="block">
                  <span className="text-sm font-medium">ক্রম (Order)</span>
                  <input type="number" name="order" className="mt-1 w-full rounded border p-2" value={formData.order || ""} onChange={handleChange} />
                </label>
              )}

              <div className="flex gap-2">
                <button type="submit" disabled={saving || uploading} className="rounded bg-emerald-700 px-6 py-2 text-white font-semibold hover:bg-emerald-800 disabled:opacity-50">
                  {uploading ? "আপলোড হচ্ছে..." : saving ? "সেভ হচ্ছে..." : (editId ? "আপডেট করুন" : "সেভ করুন")}
                </button>
                {editId && (
                  <button type="button" onClick={() => {setEditId(null); setFormData({}); setFile(null);}} className="rounded bg-gray-400 px-4 py-2 text-white">
                    বাতিল
                  </button>
                )}
              </div>
            </form>
          )}

          {activeTab !== "settings" && (
            <div className={`rounded-xl bg-white p-6 shadow ${isReadOnly ? "md:col-span-2" : ""}`}>
              <h2 className="text-lg font-semibold mb-4">বর্তমান {activeTab} লিস্ট</h2>
              {items.length === 0 ? <p className="text-gray-500">কোনো ডেটা নেই।</p> : (
                <ul className="space-y-3">
                  {items.map(item => (
                    <li key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                      <div>
                        {activeTab === "volunteers" && (
                          <>
                            <p className="font-semibold text-emerald-800">{item.name}</p>
                            <p className="text-sm text-gray-600">ফোন: {item.phone || "N/A"} | ইমেইল: {item.email || "N/A"}</p>
                            <p className="text-sm text-gray-500 italic mt-1">"{item.message}"</p>
                          </>
                        )}
                        {activeTab === "messages" && (
                          <>
                            <p className="font-semibold text-emerald-800">{item.name}</p>
                            <p className="text-sm text-gray-600">ফোন: {item.phone || "N/A"} | ইমেইল: {item.email || "N/A"}</p>
                            <p className="text-sm text-gray-500 italic mt-1">"{item.message}"</p>
                          </>
                        )}
                        {activeTab !== "volunteers" && activeTab !== "messages" && (
                          <p className="font-semibold">{item.titleBn || item.captionBn || item.name}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!isReadOnly && (
                          <button onClick={() => handleEdit(item)} className="text-sm bg-blue-500 text-white px-2 py-1 rounded">এডিট</button>
                        )}
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
