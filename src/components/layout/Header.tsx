/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/services", label: "Servicios" },
  { href: "/videos", label: "Videos" },
  { href: "/branches", label: "Sucursales" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/85 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Mobile hamburger (LEFT) */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border bg-white px-3 py-2 text-sm hover:bg-zinc-50 sm:hidden"
          style={{ borderColor: "var(--cefix-border)" }}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>

        {/* Logo CENTERED on mobile, normal on desktop */}
        <a
          href="/"
          className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 flex items-center gap-3"
        >
          <div className="relative h-12 w-[180px] sm:h-14 sm:w-[220px]">
            <Image
              src="/cefix-logo.png"
              alt="CEFIX"
              fill
              className="object-contain"
              priority
            />
          </div>

        </a> 

        {/* Desktop nav (RIGHT) */}
        <nav className="hidden items-center gap-2 sm:flex">
          {links.map((l) => (
            <a
              key={l.href}
              className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100"
              href={l.href}
            >
              {l.label}
            </a>
          ))}
          <a
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 active:opacity-90"
            style={{ background: "var(--cefix-blue)" }}
            href="/appointment"
          >
            Agendar
          </a>
        </nav>

        {/* Spacer to balance layout on mobile */}
        <div className="w-[44px] sm:hidden" />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="sm:hidden">
          <button
            aria-label="Cerrar menú"
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setOpen(false)}
          />

          <div
            className="fixed left-0 top-0 z-50 h-dvh w-[85%] max-w-sm border-r bg-white p-4 shadow-xl"
            style={{ borderColor: "var(--cefix-border)" }}
          >
{/* Drawer header / Branding */}
<div className="relative">
  <button
    aria-label="Cerrar menú"
    className="absolute right-0 top-0 rounded-xl border bg-white px-3 py-2 text-sm hover:bg-zinc-50"
    style={{ borderColor: "var(--cefix-border)" }}
    onClick={() => setOpen(false)}
  >
    ✕
  </button>

  <div className="flex justify-center pt-6 pb-4">
    <div className="relative h-16 w-[220px]">
      <Image
        src="/cefix-logo.png"
        alt="CEFIX"
        fill
        className="object-contain"
        priority
      />
    </div>
  </div>

  <div
    className="mx-auto mb-4 h-px w-4/5"
    style={{ background: "var(--cefix-border)" }}
  />
</div>


            <nav className="mt-6 grid gap-2">
              {links.map((l) => (
                <a
                  key={l.href}
                  className="rounded-2xl border bg-white px-4 py-3 text-sm hover:bg-zinc-50"
                  style={{ borderColor: "var(--cefix-border)" }}
                  href={l.href}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}

              <a
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
                style={{ background: "var(--cefix-blue)" }}
                href="/appointment"
                onClick={() => setOpen(false)}
              >
                📅 Agendar cita
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
