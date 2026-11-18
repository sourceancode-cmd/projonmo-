"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useList } from "@/lib/content";

export default function HeroSlider() {
  const { items } = useList("sliders");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return <div className="h-[60vh] min-h-[380px] bg-emerald-900" />;
  const s = items[i];

  return (
    <section className="relative h-[60vh] min-h-[380px] overflow-hidden bg-emerald-900 text-white">
      {items.map((x, n) => (
        <img
          key={x.id}
          src={x.image}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            n === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4">
        <h2 className="max-w-2xl text-3xl font-bold md:text-5xl">{s.title}</h2>
        {s.subtitle && <p className="mt-3 max-w-xl text-lg text-gray-100">{s.subtitle}</p>}
        <Link
          href={s.link || "/donate"}
          className="mt-6 w-fit rounded-full bg-emerald-600 px-6 py-2.5 font-semibold hover:bg-emerald-500"
        >
          {s.button || "অনুদান দিন"}
        </Link>
      </div>
      {items.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {items.map((x, n) => (
            <button
              key={x.id}
              type="button"
              aria-label={`স্লাইড ${n + 1}`}
              onClick={() => setI(n)}
              className={`h-2.5 w-2.5 rounded-full ${n === i ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
