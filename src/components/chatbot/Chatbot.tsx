"use client";

import { useMemo, useState } from "react";
import { routePatient } from "@/lib/triage/rules";
import type { Intent, UrgencyLevel } from "@/lib/triage/types";
import type { BodyZone } from "@/lib/content/services";
import { BRANCHES } from "@/lib/content/branches";
import type { CityZone } from "@/lib/content/branches";

type Step = "intent" | "urgency_level" | "city_zone" | "zone" | "result";

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

  return (
    <div className="mx-auto max-w-xl p-4">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h1 className="text-xl font-semibold">Clínica de Fisioterapia</h1>
        <p className="mt-1 text-sm text-gray-600">
          Responde unas preguntas para orientarte (sin diagnóstico).
        </p>

        <div className="mt-4 space-y-3">
          {step === "intent" && (
            <>
              <p className="font-medium">¿Qué necesitas hoy?</p>
              <div className="grid gap-2">
                <button
                  className="rounded-xl border px-4 py-3 text-left hover:bg-gray-50"
                  onClick={() => {
                    setIntent("urgency");
                    setStep("urgency_level");
                  }}
                >
                  🔴 Tengo una urgencia
                </button>

                <button
                  className="rounded-xl border px-4 py-3 text-left hover:bg-gray-50"
                  onClick={() => {
                    setIntent("appointment");
                    setStep("city_zone");
                  }}
                >
                  📅 Quiero agendar una cita
                </button>
              </div>
            </>
          )}

          {step === "urgency_level" && (
            <>
              <p className="font-medium">¿Qué tan urgente se siente?</p>
              <div className="grid gap-2">
                <button
                  className="rounded-xl border px-4 py-3 text-left hover:bg-gray-50"
                  onClick={() => {
                    setUrgencyLevel("high");
                    setStep("city_zone");
                  }}
                >
                  Dolor intenso / accidente / no puedo mover bien
                </button>
                <button
                  className="rounded-xl border px-4 py-3 text-left hover:bg-gray-50"
                  onClick={() => {
                    setUrgencyLevel("medium");
                    setStep("city_zone");
                  }}
                >
                  Molestia moderada / limita un poco
                </button>
                <button
                  className="rounded-xl border px-4 py-3 text-left hover:bg-gray-50"
                  onClick={() => {
                    setUrgencyLevel("low");
                    setStep("city_zone");
                  }}
                >
                  Leve / prevención / molestia ligera
                </button>
              </div>
            </>
          )}

          {step === "city_zone" && (
            <>
              <p className="font-medium">¿Qué zona te queda más cerca?</p>
              <div className="grid gap-2">
                <button
                  className="rounded-xl border px-4 py-3 text-left hover:bg-gray-50"
                  onClick={() => {
                    setCityZone("near_museo");
                    setStep("zone");
                  }}
                >
                  🏛️ Cerca de Museo
                </button>

                <button
                  className="rounded-xl border px-4 py-3 text-left hover:bg-gray-50"
                  onClick={() => {
                    setCityZone("near_araucarias");
                    setStep("zone");
                  }}
                >
                  🌳 Cerca de Araucarias
                </button>

                <button
                  className="rounded-xl border px-4 py-3 text-left hover:bg-gray-50"
                  onClick={() => {
                    setCityZone("unknown");
                    setStep("zone");
                  }}
                >
                  🤷‍♂️ No estoy seguro
                </button>
              </div>
            </>
          )}

          {step === "zone" && (
            <>
              <p className="font-medium">¿Qué zona del cuerpo quieres tratar?</p>
              <div className="grid gap-2 sm:grid-cols-2">
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
                    className="rounded-xl border px-4 py-3 text-left hover:bg-gray-50"
                    onClick={() => {
                      setZone(value);
                      setStep("result");
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "result" && result && recommendedBranch && (
            <>
              <div className="rounded-xl border p-3">
                <p className="text-sm text-gray-600">Recomendación</p>
                <p className="mt-1 text-lg font-semibold">{recommendedBranch.name}</p>
                <p className="mt-1 text-sm text-gray-700">{recommendedBranch.address}</p>
                <p className="mt-2 text-xs text-gray-500">{result.disclaimer}</p>
              </div>

              <div className="grid gap-2">
                <a
                  className="rounded-xl border px-4 py-3 text-center hover:bg-gray-50"
                  href={recommendedBranch.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  📍 Ver ubicación
                </a>

                <a
                  className="rounded-xl bg-black px-4 py-3 text-center text-white hover:opacity-90"
                href={`/appointment?branch=${encodeURIComponent(
  result.recommendedBranchId
)}&zone=${encodeURIComponent(zone ?? "")}${
  result.recommendedServiceId ? `&service=${encodeURIComponent(result.recommendedServiceId)}` : ""
}`}

                >
                  📅 Agendar cita
                </a>

                <button
                  className="rounded-xl border px-4 py-3 text-center hover:bg-gray-50"
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

      <nav className="mt-4 flex flex-wrap gap-2 text-sm">
        <a className="rounded-full border px-3 py-1 hover:bg-gray-50" href="/services">
          Servicios
        </a>
        <a className="rounded-full border px-3 py-1 hover:bg-gray-50" href="/videos">
          Videos
        </a>
        <a className="rounded-full border px-3 py-1 hover:bg-gray-50" href="/branches">
          Sucursales
        </a>
      </nav>
    </div>
  );
}
