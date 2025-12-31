/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BRANCHES } from "@/lib/content/branches";
import { routePatient } from "@/lib/triage/rules";
import type { Intent, UrgencyLevel } from "@/lib/triage/types";
import type { BodyZone } from "@/lib/content/services";
import type { CityZone } from "@/lib/content/branches";

type Step = "intent" | "urgency" | "city" | "body" | "result";

type Msg =
  | { id: string; role: "bot"; text: string }
  | { id: string; role: "user"; text: string }
  | { id: string; role: "bot"; kind: "options"; title?: string; options: { label: string; onPick: () => void }[] }
  | { id: string; role: "bot"; kind: "card"; title: string; lines: string[]; ctas: { label: string; href?: string; onClick?: () => void; primary?: boolean }[] };

function uid() {
  return Math.random().toString(16).slice(2);
}

const ZONE_LABELS: Record<string, string> = {
  neck: "Cuello",
  shoulder: "Hombro",
  back: "Espalda",
  low_back: "Espalda baja",
  knee: "Rodilla",
  ankle: "Tobillo",
};

export default function Chatbot() {
  const [step, setStep] = useState<Step>("intent");

  const [intent, setIntent] = useState<Intent | null>(null);
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel | null>(null);
  const [cityZone, setCityZone] = useState<CityZone | null>(null);
  const [bodyZone, setBodyZone] = useState<BodyZone | null>(null);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  const result = useMemo(() => {
    if (!intent) return null;
    return routePatient({
      intent,
      urgencyLevel: urgencyLevel ?? undefined,
      cityZone: cityZone ?? undefined,
      zone: bodyZone ?? undefined,
    });
  }, [intent, urgencyLevel, cityZone, bodyZone]);

  const recommendedBranch = result
    ? BRANCHES.find((b) => b.id === result.recommendedBranchId) ?? null
    : null;

  // Autoscroll
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function botSay(text: string) {
    setMessages((m) => [...m, { id: uid(), role: "bot", text }]);
  }

  function userSay(text: string) {
    setMessages((m) => [...m, { id: uid(), role: "user", text }]);
  }

  function showTyping(ms = 350) {
    setTyping(true);
    window.setTimeout(() => setTyping(false), ms);
  }

  function resetAll() {
    setStep("intent");
    setIntent(null);
    setUrgencyLevel(null);
    setCityZone(null);
    setBodyZone(null);
    setMessages([]);
    setTyping(false);
    // re-seed
    seed();
  }

  function seed() {
    setMessages([
      { id: uid(), role: "bot", text: "Hola 👋 Soy el asistente de CEFIX. Te hago unas preguntas rápidas para orientarte (sin diagnóstico)." },
      {
        id: uid(),
        role: "bot",
        kind: "options",
        title: "¿Qué necesitas hoy?",
        options: [
          {
            label: "Tengo una urgencia ⚠️",
            onPick: () => {
              userSay("Tengo una urgencia");
              setIntent("urgency");
              showTyping();
              setStep("urgency");
            },
          },
          {
            label: "Quiero agendar una cita 📅",
            onPick: () => {
              userSay("Quiero agendar una cita");
              setIntent("appointment");
              showTyping();
              setStep("city");
            },
          },
        ],
      },
    ]);
  }

  // init once
  useEffect(() => {
    seed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step prompts (when step changes)
  useEffect(() => {
    if (typing) return;

    if (step === "urgency") {
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "bot",
          kind: "options",
          title: "¿Qué tan urgente se siente?",
          options: [
            {
              label: "Alta (dolor intenso / accidente / limitación fuerte)",
              onPick: () => {
                userSay("Urgencia alta");
                setUrgencyLevel("high");
                showTyping();
                setStep("city");
              },
            },
            {
              label: "Media",
              onPick: () => {
                userSay("Urgencia media");
                setUrgencyLevel("medium");
                showTyping();
                setStep("city");
              },
            },
            {
              label: "Baja",
              onPick: () => {
                userSay("Urgencia baja");
                setUrgencyLevel("low");
                showTyping();
                setStep("city");
              },
            },
          ],
        },
      ]);
    }

    if (step === "city") {
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "bot",
          kind: "options",
          title: "¿Qué zona de la ciudad te queda más cerca?",
          options: [
            {
              label: "Cerca de Museo",
              onPick: () => {
                userSay("Cerca de Museo");
                setCityZone("near_museo");
                showTyping();
                setStep("body");
              },
            },
            {
              label: "Cerca de Araucarias",
              onPick: () => {
                userSay("Cerca de Araucarias");
                setCityZone("near_araucarias");
                showTyping();
                setStep("body");
              },
            },
            {
              label: "No estoy seguro",
              onPick: () => {
                userSay("No estoy seguro");
                setCityZone("unknown");
                showTyping();
                setStep("body");
              },
            },
          ],
        },
      ]);
    }

    if (step === "body") {
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "bot",
          kind: "options",
          title: "¿Qué zona del cuerpo quieres tratar?",
          options: ([
            ["neck", "Cuello"],
            ["shoulder", "Hombro"],
            ["back", "Espalda"],
            ["low_back", "Espalda baja"],
            ["knee", "Rodilla"],
            ["ankle", "Tobillo"],
          ] as const).map(([v, label]) => ({
            label,
            onPick: () => {
              userSay(label);
              setBodyZone(v);
              showTyping();
              setStep("result");
            },
          })),
        },
      ]);
    }

    if (step === "result" && result && recommendedBranch) {
      const zoneText = bodyZone ? (ZONE_LABELS[bodyZone] ?? String(bodyZone)) : "";

      setMessages((m) => [
        ...m,
        { id: uid(), role: "bot", text: "Listo. Con base en lo que me dijiste, esta es la mejor recomendación:" },
        {
          id: uid(),
          role: "bot",
          kind: "card",
          title: recommendedBranch.name,
          lines: [
            recommendedBranch.address,
            recommendedBranch.hours,
            zoneText ? `Zona del cuerpo: ${zoneText}` : "",
            result.disclaimer,
          ].filter(Boolean),
          ctas: [
            { label: "📍 Ver ubicación", href: recommendedBranch.mapsUrl },
            {
              label: "📅 Agendar cita",
              href: `/appointment?branch=${encodeURIComponent(recommendedBranch.id)}${
                bodyZone ? `&zone=${encodeURIComponent(bodyZone)}` : ""
              }${result.recommendedServiceId ? `&service=${encodeURIComponent(result.recommendedServiceId)}` : ""}`,
              primary: true,
            },
            { label: "Reiniciar", onClick: resetAll },
          ],
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, typing]);

  return (
<div
  className="mx-auto w-full max-w-none md:max-w-xl lg:max-w-lg rounded-3xl border bg-white shadow-sm"
  style={{ borderColor: "var(--cefix-border)" }}
>

      {/* Header mini */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <div className="text-sm font-semibold" style={{ color: "var(--cefix-blue)" }}>
            Asistente CEFIX
          </div>
          <div className="text-xs text-zinc-500">Orientación rápida (sin diagnóstico)</div>
        </div>

        <button
          type="button"
          className="rounded-xl border bg-white px-3 py-2 text-xs hover:bg-zinc-50"
          style={{ borderColor: "var(--cefix-border)" }}
          onClick={resetAll}
        >
          Reiniciar
        </button>
      </div>

      <div className="h-px w-full" style={{ background: "var(--cefix-border)" }} />

      {/* Messages */}
      <div ref={listRef} className="max-h-[64vh] overflow-auto px-4 py-4 sm:px-5">
        <div className="grid gap-3">
          {messages.map((msg) => {
            if (msg.role === "bot" && "kind" in msg && msg.kind === "options") {
              return (
                <div key={msg.id} className="cefix-pop">
                  {msg.title ? (
                    <div className="mb-2 text-sm font-semibold" style={{ color: "var(--cefix-blue)" }}>
                      {msg.title}
                    </div>
                  ) : null}

                  <div className="grid gap-2">
                    {msg.options.map((o, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="rounded-2xl border bg-white px-4 py-3 text-left text-sm hover:bg-zinc-50 active:bg-zinc-100 transition-colors"
                        style={{ borderColor: "var(--cefix-border)" }}
                        onClick={o.onPick}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            if (msg.role === "bot" && "kind" in msg && msg.kind === "card") {
              return (
                <div key={msg.id} className="cefix-pop rounded-3xl border bg-zinc-50 p-4" style={{ borderColor: "var(--cefix-border)" }}>
                  <div className="text-sm font-semibold" style={{ color: "var(--cefix-blue)" }}>
                    {msg.title}
                  </div>
                  <div className="mt-2 grid gap-1 text-sm text-zinc-700">
                    {msg.lines.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>

                  <div className="mt-3 grid gap-2">
                    {msg.ctas.map((c, i) => {
                      if (c.href) {
                        return (
                          <a
                            key={i}
                            href={c.href}
                            target={c.href.startsWith("http") ? "_blank" : undefined}
                            rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                            className={[
                              "rounded-2xl px-4 py-3 text-sm font-medium text-center transition-opacity",
                              c.primary ? "text-white" : "border bg-white hover:bg-zinc-50",
                            ].join(" ")}
                            style={
                              c.primary
                                ? { background: "var(--cefix-blue)" }
                                : { borderColor: "var(--cefix-border)" }
                            }
                          >
                            {c.label}
                          </a>
                        );
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          className="rounded-2xl border bg-white px-4 py-3 text-sm hover:bg-zinc-50"
                          style={{ borderColor: "var(--cefix-border)" }}
                          onClick={c.onClick}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // Plain bubble
            const isUser = msg.role === "user";
            return (
              <div key={msg.id} className={`cefix-pop flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={[
                    "max-w-[85%] rounded-3xl px-4 py-3 text-sm",
                    isUser ? "text-white" : "border bg-white text-zinc-800",
                  ].join(" ")}
                  style={
                    isUser
                      ? { background: "var(--cefix-blue)" }
                      : { borderColor: "var(--cefix-border)" }
                  }
                >
                  {"text" in msg ? msg.text : ""}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {typing ? (
            <div className="cefix-pop flex justify-start">
              <div
                className="rounded-3xl border bg-white px-4 py-3"
                style={{ borderColor: "var(--cefix-border)" }}
              >
                <div className="flex items-center gap-1">
                  <span className="cefix-dot inline-block h-2 w-2 rounded-full bg-zinc-400" />
                  <span className="cefix-dot inline-block h-2 w-2 rounded-full bg-zinc-400" />
                  <span className="cefix-dot inline-block h-2 w-2 rounded-full bg-zinc-400" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Footer hint */}
      <div className="h-px w-full" style={{ background: "var(--cefix-border)" }} />
      <div className="px-4 py-3 text-[11px] text-zinc-500 sm:px-5">
        Consejo: si el dolor es intenso o hay lesión reciente, busca atención inmediata.
      </div>
    </div>
  );
}
