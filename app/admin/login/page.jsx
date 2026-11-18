"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/admin");
    } catch (err) {
      setError("লগইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড চেক করুন।");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-emerald-800">অ্যাডমিন লগইন</h1>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-gray-700">ইমেইল</span>
          <input type="email" required className="w-full rounded-lg border px-3 py-2" 
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="mb-6 block">
          <span className="mb-1 block text-sm font-medium text-gray-700">পাসওয়ার্ড</span>
          <input type="password" required className="w-full rounded-lg border px-3 py-2" 
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" className="w-full rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800">
          লগইন করুন
        </button>
      </form>
    </div>
  );
}
