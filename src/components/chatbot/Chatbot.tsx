"use client";

import { useMemo, useState } from "react";
import { routePatient } from "@/lib/triage/rules";
import type { Intent, UrgencyLevel } from "@/lib/triage/types";
import type { BodyZone } from "@/lib/content/services";
import { BRANCHES } from "@/lib/content/branches";
import type { CityZone } from "@/lib/content/branches";

type Step = "intent" | "urgency_level" | "city_zone" | "zone" | "result";

const card =
  "rounded-3xl border p-6 shadow-sm bg-white";
const softCard =
  "rounded-2xl border p-4 bg-zinc-50";
const title = "text-xl font-semibold tracking-tight";
const sub = "mt-1 text-sm text-zinc-600";

const sectionLabel =
  "text-xs font-semibold uppercase tracking-wide text-zinc-500";

const optionBtn =
  "w-full rounded-2xl border bg-white px-4 py-3 text-left " +
  "hover:bg-zinc-50 active:bg-zinc-100 transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-black/10";

const optionBtnStrong =
  "w-full rounded-2xl px-4 py-3 text-left text-white " +
  "hover:opacity-95 active:opacity-90 transition-opacity " +
  "focus:outline-none focus:ring-2 focus:ring-black/10";

const pillNav =
  "rounded-full border bg-white px-3 py-1 text-sm hover:bg-zinc-50";

function StepPill({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-xs font-medium border",
        active ? "text-white" : "text-zinc-600 bg-white",
      ].join(" ")}
      style={active ? { background: "var(--cefix-blue)", borderColor: "var(--cefix-blue)" } : { borderColor: "var(--cefix-border)" }}
    >
      {children}
    </span>
  );
}

export default function Chatbot() {
  const [step, setStep] = useState<Step>("intent");

  const [intent, setIntent] = useState<Intent | null>(null);
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel | null>(null);
  const [cityZone, setCityZone] = useState<CityZone | null>(null);
  const [zone, setZone] = useState<BodyZone | null>(null);

  const result = useMemo(() => {
    if (!intent) return null;

    return routePatient({
      intent,
      urgencyLevel: urgencyLevel ?? undefined,
      cityZone: cityZone ?? undefined,
      zone: zone ?? undefined,
    });
  }, [intent, urgencyLevel, cityZone, zone]);

  const recommendedBranch = result
    ? BRANCHES.find((b) => b.id === result.recommendedBranchId)
    : null;

  const stepIndex =
    step === "intent" ? 1 :
    step === "urgency_level" ? 2 :
    step === "city_zone" ? 3 :
    step === "zone" ? 4 : 5;

  return (
    <div className="mx-auto max-w-xl">
      <div
        className={card}
        style={{ borderColor: "var(--cefix-border)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className={title} style={{ color: "var(--cefix-blue)" }}>
              Orientación rápida
            </h1>
            <p className={sub}>
              Responde unas preguntas para orientarte <span className="font-medium">(sin diagnóstico)</span>.
            </p>
          </div>

          {/* Step pills */}
          <div className="hidden sm:flex flex-wrap justify-end gap-2">
            <StepPill active={stepIndex === 1}>1 Inicio</StepPill>
            <StepPill active={stepIndex === 2}>2 Urgencia</StepPill>
            <StepPill active={stepIndex === 3}>3 Zona ciudad</StepPill>
            <StepPill active={stepIndex === 4}>4 Cuerpo</StepPill>
            <StepPill active={stepIndex === 5}>5 Resultado</StepPill>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-5 h-px w-full" style={{ background: "var(--cefix-border)" }} />

        <div className="mt-5 space-y-4">
          {step === "intent" && (
            <>
              <div>
                <div className={sectionLabel}>Paso 1</div>
                <p className="mt-1 text-base font-semibold" style={{ color: "var(--cefix-blue)" }}>
                  ¿Qué necesitas hoy?
                </p>
              </div>

              <div className="grid gap-3">
                <button
                  className={optionBtn}
                  onClick={() => {
                    setIntent("urgency");
                    setStep("urgency_level");
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full"
                      style={{ background: "#fff1f2", color: "#b91c1c" }}
                    >
                      ●
                    </span>
                    <div>
                      <div className="font-semibold">Tengo una urgencia</div>
                      <div className="mt-0.5 text-sm text-zinc-600">
                        Dolor intenso, accidente o limitación fuerte.
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  className={optionBtn}
                  onClick={() => {
                    setIntent("appointment");
                    setStep("city_zone");
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full"
                      style={{ background: "#eef6ff", color: "var(--cefix-blue)" }}
                    >
                      📅
                    </span>
                    <div>
                      <div className="font-semibold">Quiero agendar una cita</div>
                      <div className="mt-0.5 text-sm text-zinc-600">
                        Agendar valoración o tratamiento.
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="rounded-2xl border p-4" style={{ borderColor: "var(--cefix-border)", background: "#fbfdff" }}>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex h-2 w-2 rounded-full"
                    style={{ background: "var(--cefix-yellow)" }}
                  />
                  <p className="text-xs text-zinc-600">
                    Si presentas síntomas graves o empeoran rápidamente, acude a atención inmediata.
                  </p>
                </div>
              </div>
            </>
          )}

          {step === "urgency_level" && (
            <>
              <div>
                <div className={sectionLabel}>Paso 2</div>
                <p className="mt-1 text-base font-semibold" style={{ color: "var(--cefix-blue)" }}>
                  ¿Qué tan urgente se siente?
                </p>
              </div>

              <div className="grid gap-3">
                <button
                  className={optionBtn}
                  onClick={() => {
                    setUrgencyLevel("high");
                    setStep("city_zone");
                  }}
                >
                  <div className="font-semibold">Alta</div>
                  <div className="mt-0.5 text-sm text-zinc-600">
                    Dolor intenso / accidente / no puedo mover bien
                  </div>
                </button>

                <button
                  className={optionBtn}
                  onClick={() => {
                    setUrgencyLevel("medium");
                    setStep("city_zone");
                  }}
                >
                  <div className="font-semibold">Media</div>
                  <div className="mt-0.5 text-sm text-zinc-600">
                    Molestia moderada / limita un poco
                  </div>
                </button>

                <button
                  className={optionBtn}
                  onClick={() => {
                    setUrgencyLevel("low");
                    setStep("city_zone");
                  }}
                >
                  <div className="font-semibold">Baja</div>
                  <div className="mt-0.5 text-sm text-zinc-600">
                    Leve / prevención / molestia ligera
                  </div>
                </button>
              </div>
            </>
          )}

          {step === "city_zone" && (
            <>
              <div>
                <div className={sectionLabel}>Paso 3</div>
                <p className="mt-1 text-base font-semibold" style={{ color: "var(--cefix-blue)" }}>
                  ¿Qué zona te queda más cerca?
                </p>
              </div>

              <div className="grid gap-3">
                <button
                  className={optionBtn}
                  onClick={() => {
                    setCityZone("near_museo");
                    setStep("zone");
                  }}
                >
                  <div className="font-semibold">Cerca de Museo</div>
                  <div className="mt-0.5 text-sm text-zinc-600">Sugerimos la sucursal más conveniente.</div>
                </button>

                <button
                  className={optionBtn}
                  onClick={() => {
                    setCityZone("near_araucarias");
                    setStep("zone");
                  }}
                >
                  <div className="font-semibold">Cerca de Araucarias</div>
                  <div className="mt-0.5 text-sm text-zinc-600">Sugerimos la sucursal más conveniente.</div>
                </button>

                <button
                  className={optionBtn}
                  onClick={() => {
                    setCityZone("unknown");
                    setStep("zone");
                  }}
                >
                  <div className="font-semibold">No estoy seguro</div>
                  <div className="mt-0.5 text-sm text-zinc-600">Te damos la mejor opción disponible.</div>
                </button>
              </div>
            </>
          )}

          {step === "zone" && (
            <>
              <div>
                <div className={sectionLabel}>Paso 4</div>
                <p className="mt-1 text-base font-semibold" style={{ color: "var(--cefix-blue)" }}>
                  ¿Qué zona del cuerpo quieres tratar?
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["neck", "Cuello"],
                    ["shoulder", "Hombro"],
                    ["back", "Espalda"],
                    ["low_back", "Espalda baja"],
                    ["knee", "Rodilla"],
                    ["ankle", "Tobillo"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    className={optionBtn}
                    onClick={() => {
                      setZone(value);
                      setStep("result");
                    }}
                  >
                    <span className="font-semibold">{label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "result" && result && recommendedBranch && (
            <>
              <div
                className={softCard}
                style={{ borderColor: "var(--cefix-border)", background: "#fbfdff" }}
              >
                <div className={sectionLabel}>Recomendación</div>
                <p className="mt-1 text-lg font-semibold" style={{ color: "var(--cefix-blue)" }}>
                  {recommendedBranch.name}
                </p>
                <p className="mt-1 text-sm text-zinc-700">{recommendedBranch.address}</p>
                <p className="mt-2 text-xs text-zinc-500">{result.disclaimer}</p>
              </div>

              <div className="grid gap-2">
                <a
                  className={optionBtn}
                  href={recommendedBranch.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  📍 Ver ubicación
                </a>

                <a
                  className={optionBtnStrong}
                  style={{ background: "var(--cefix-blue)" }}
                  href={`/appointment?branch=${encodeURIComponent(
                    result.recommendedBranchId
                  )}&zone=${encodeURIComponent(zone ?? "")}${
                    result.recommendedServiceId
                      ? `&service=${encodeURIComponent(result.recommendedServiceId)}`
                      : ""
                  }`}
                >
                  📅 Agendar cita
                </a>

                <button
                  className={optionBtn}
                  onClick={() => {
                    setStep("intent");
                    setIntent(null);
                    setUrgencyLevel(null);
                    setCityZone(null);
                    setZone(null);
                  }}
                >
                  Reiniciar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Secondary nav (optional; header already has links) */}
      <nav className="mt-4 flex flex-wrap gap-2">
        <a className={pillNav} style={{ borderColor: "var(--cefix-border)" }} href="/services">
          Servicios
        </a>
        <a className={pillNav} style={{ borderColor: "var(--cefix-border)" }} href="/videos">
          Videos
        </a>
        <a className={pillNav} style={{ borderColor: "var(--cefix-border)" }} href="/branches">
          Sucursales
        </a>
      </nav>
    </div>
  );
}
