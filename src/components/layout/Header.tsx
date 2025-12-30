/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const links = [
  { href: "/services", label: "Servicios" },
  { href: "/videos", label: "Videos" },
  { href: "/branches", label: "Sucursales" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // Cierra el menú con ESC
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Evita scroll del body cuando el menú está abierto (móvil)
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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo con más protagonismo */}
        <a href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-[170px] sm:h-12 sm:w-[190px]">
            <Image
              src="/cefix-logo.png"
              alt="CEFIX"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Tagline (solo desktop) */}
          <div className="hidden sm:block leading-tight">
            <div className="text-sm font-semibold" style={{ color: "var(--cefix-blue)" }}>
              Centro Fisioterapéutico Xalapa
            </div>
            <div className="text-xs text-zinc-500">
              Atención profesional • Citas y urgencias
            </div>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 sm:flex">
          {links.map((l) => (
            <a key={l.href} className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100" href={l.href}>
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

        {/* Mobile hamburger */}
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
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="sm:hidden">
          {/* overlay */}
          <button
            aria-label="Cerrar menú"
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* panel */}
          <div
            className="fixed right-0 top-0 z-50 h-dvh w-[85%] max-w-sm border-l bg-white p-4 shadow-xl"
            style={{ borderColor: "var(--cefix-border)" }}
          >
            <div className="flex items-center justify-between">
              <div className="relative h-10 w-[160px]">
                <Image
                  src="/cefix-logo.png"
                  alt="CEFIX"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <button
                className="rounded-xl border bg-white px-3 py-2 text-sm hover:bg-zinc-50"
                style={{ borderColor: "var(--cefix-border)" }}
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-2xl border bg-zinc-50 p-3" style={{ borderColor: "var(--cefix-border)" }}>
              <div className="text-sm font-semibold" style={{ color: "var(--cefix-blue)" }}>
                Centro Fisioterapéutico Xalapa
              </div>
              <div className="mt-1 text-xs text-zinc-600">
                Agenda cita o recibe orientación rápida.
              </div>
            </div>

            <nav className="mt-4 grid gap-2">
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
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-white hover:opacity-95 active:opacity-90"
                style={{ background: "var(--cefix-blue)" }}
                href="/appointment"
                onClick={() => setOpen(false)}
              >
                📅 Agendar
              </a>

              <a
                className="rounded-2xl border bg-white px-4 py-3 text-sm hover:bg-zinc-50"
                style={{ borderColor: "var(--cefix-border)" }}
                href="/"
                onClick={() => setOpen(false)}
              >
                🏠 Inicio
              </a>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
