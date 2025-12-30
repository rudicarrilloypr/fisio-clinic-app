/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "CEFIX | Centro Fisioterapéutico Xalapa",
  description: "Agenda citas, consulta servicios y videos terapéuticos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className="min-h-screen"
        style={{ background: "var(--cefix-bg)", color: "var(--cefix-blue)" }}
      >
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-[140px]">
                <Image
                  src="/cefix-logo.png"
                  alt="CEFIX"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </a>

            <nav className="hidden items-center gap-2 sm:flex">
              <a className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100" href="/services">
                Servicios
              </a>
              <a className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100" href="/videos">
                Videos
              </a>
              <a className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100" href="/branches">
                Sucursales
              </a>

              <a
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm"
                style={{ background: "var(--cefix-blue)" }}
                href="/appointment"
              >
                Agendar
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        <footer className="border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-500">
            © {new Date().getFullYear()} CEFIX · Este chatbot no realiza diagnósticos. Ante dolor intenso, acude a atención inmediata.
          </div>
        </footer>
      </body>
    </html>
  );
}
