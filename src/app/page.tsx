import Chatbot from "@/components/chatbot/Chatbot";

export default function HomePage() {
  return (
    <div className="grid gap-6">
      {/* Hero clínico */}
      <section
        className="rounded-3xl border p-6 shadow-sm"
        style={{ background: "var(--cefix-card)", borderColor: "var(--cefix-border)" }}
      >
        <div className="grid gap-2">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--cefix-blue)" }}>
            Atención clara y profesional.
          </h1>
          <p className="text-sm text-zinc-600">
            Responde unas preguntas y te orientamos para{" "}
            <span className="font-medium" style={{ color: "var(--cefix-blue)" }}>
              urgencia
            </span>{" "}
            o{" "}
            <span className="font-medium" style={{ color: "var(--cefix-blue)" }}>
              agendar cita
            </span>{" "}
            (sin diagnóstico).
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: "#fff7e6", color: "var(--cefix-blue)" }}
            >
              Sin login (MVP)
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: "#eef6ff", color: "var(--cefix-blue)" }}
            >
              Confirmación por WhatsApp
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: "#eef6ff", color: "var(--cefix-blue)" }}
            >
              Sucursales: Museo / Araucarias
            </span>
          </div>
        </div>
      </section>

      {/* Card chatbot */}
      <section
        className="rounded-3xl border p-6 shadow-sm"
        style={{ background: "var(--cefix-card)", borderColor: "var(--cefix-border)" }}
      >
        <Chatbot />
      </section>
    </div>
  );
}
