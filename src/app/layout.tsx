 
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "CEFIX | Centro Fisioterapéutico Xalapa",
  description: "Agenda citas, consulta servicios y videos terapéuticos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className="min-h-dvh flex flex-col"
        style={{ background: "var(--cefix-bg)", color: "var(--cefix-blue)" }}
      >
        <Header />

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</div>
        </main>

        <footer className="border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-500">
            © {new Date().getFullYear()} CEFIX · Este chatbot no realiza diagnósticos. Ante dolor intenso, acude a atención inmediata.
          </div>
        </footer>
      </body>
    </html>
  );
}
