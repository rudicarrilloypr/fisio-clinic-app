/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Branch } from "@/lib/content/branches";
import type { Service, BodyZone } from "@/lib/content/services";

const ZONE_LABELS: Record<string, string> = {
  neck: "Cuello",
  shoulder: "Hombro",
  back: "Espalda",
  low_back: "Espalda baja",
  knee: "Rodilla",
  ankle: "Tobillo",
};

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const inputBase =
  "mt-1 w-full rounded-2xl border bg-white px-3 py-2 outline-none " +
  "focus:ring-2 focus:ring-black/10 focus:border-black/20";

const labelBase = "text-sm font-medium text-zinc-900";
const helperBase = "mt-1 text-xs text-zinc-500";

export default function AppointmentForm(props: {
  initialBranchId: Branch["id"];
  initialZone?: BodyZone;
  initialServiceId?: string;
  branches?: Branch[];
  services?: Service[];
}) {
  const router = useRouter();

  // ✅ Always work with arrays (prevents undefined crashes)
  const branches = props.branches ?? [];
  const services = props.services ?? [];

  const [branchId, setBranchId] = useState<Branch["id"]>(props.initialBranchId);

  // ✅ Filter services by zone (MVP)
  const filteredServices = useMemo<Service[]>(() => {
    if (!props.initialZone) return services;
    return services.filter((s) => s.zones.includes(props.initialZone!));
  }, [services, props.initialZone]);

  // ✅ Choose which list to show: filtered if available, else all
  const servicePool = useMemo<Service[]>(
    () => (filteredServices.length ? filteredServices : services),
    [filteredServices, services]
  );

  // ✅ Default service id (safe)
  const computedDefaultServiceId = useMemo<string>(() => {
    if (props.initialServiceId && servicePool.some((s) => s.id === props.initialServiceId)) {
      return props.initialServiceId;
    }
    return servicePool[0]?.id ?? "sports";
  }, [props.initialServiceId, servicePool]);

  const [serviceId, setServiceId] = useState<string>(computedDefaultServiceId);

  // ✅ If zone/servicePool changes and current serviceId is no longer valid, reset it
  useEffect(() => {
    if (!servicePool.some((s) => s.id === serviceId)) {
      setServiceId(computedDefaultServiceId);
    }
  }, [servicePool, serviceId, computedDefaultServiceId]);

  const [date, setDate] = useState<string>(todayISO());
  const [time, setTime] = useState<string>("10:00");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const zoneLabel = useMemo(() => {
    if (!props.initialZone) return "";
    return ZONE_LABELS[props.initialZone] ?? String(props.initialZone);
  }, [props.initialZone]);

  const selectedBranch = branches.find((b) => b.id === branchId);
  const selectedService = services.find((s) => s.id === serviceId);

  function validate(): string | null {
    if (!name.trim()) return "Por favor escribe tu nombre.";
    if (!phone.trim()) return "Por favor escribe tu teléfono.";
    if (!date) return "Selecciona una fecha.";
    if (!time) return "Selecciona una hora.";
    if (!selectedBranch) return "Selecciona una sucursal.";
    if (!selectedService) return "Selecciona un servicio.";
    return null;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    const qp = new URLSearchParams();
    qp.set("branch", branchId);
    qp.set("service", serviceId);
    qp.set("date", date);
    qp.set("time", time);
    qp.set("name", name.trim());
    qp.set("phone", phone.trim());
    if (props.initialZone) qp.set("zone", props.initialZone);
    if (notes.trim()) qp.set("notes", notes.trim());

    router.push(`/appointment/confirm?${qp.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border bg-white p-6 shadow-sm space-y-5">
      {/* Context */}
      <div className="rounded-2xl border bg-zinc-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Contexto</p>
        <p className="mt-1 text-sm text-zinc-800">
          {props.initialZone ? (
            <>
              Zona seleccionada: <span className="font-medium">{zoneLabel}</span>
              {filteredServices.length !== services.length && filteredServices.length > 0 ? (
                <span className="text-zinc-500"> (servicios filtrados por zona)</span>
              ) : null}
            </>
          ) : (
            <>Sin zona seleccionada</>
          )}
        </p>
      </div>

      {/* Branch + Service */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelBase}>Sucursal</label>
          <select
            className={inputBase}
            value={branchId}
            onChange={(e) => setBranchId(e.target.value as Branch["id"])}
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <p className={helperBase}>{selectedBranch?.hours ?? "Horario disponible al confirmar."}</p>
        </div>

        <div>
          <label className={labelBase}>Servicio</label>
          <select
            className={inputBase}
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value as Service["id"])}
          >
            {servicePool.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <p className={helperBase}>{selectedService?.description ?? "Selecciona el tipo de atención."}</p>

          {services.length === 0 ? (
            <p className="mt-2 text-xs text-red-600">
              No hay servicios cargados aún (placeholder). Revisa src/lib/content/services.ts
            </p>
          ) : null}
        </div>
      </div>

      {/* Date + Time */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelBase}>Fecha preferida</label>
          <input
            type="date"
            className={inputBase}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <p className={helperBase}>Propones una fecha y el equipo confirma disponibilidad.</p>
        </div>

        <div>
          <label className={labelBase}>Hora preferida</label>
          <input
            type="time"
            className={inputBase}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <p className={helperBase}>El horario final se confirma por WhatsApp.</p>
        </div>
      </div>

      {/* Name + Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelBase}>Nombre</label>
          <input
            className={inputBase}
            placeholder="Ej. Roberto Martinez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div>
          <label className={labelBase}>Teléfono</label>
          <input
            className={inputBase}
            placeholder="Ej. 22 89 12 34 56"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            autoComplete="tel"
          />
          <p className={helperBase}>Solo para confirmar tu cita (sin spam).</p>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelBase}>Notas (opcional)</label>
        <textarea
          className={inputBase}
          placeholder="Ej. dolor desde hace 3 días, lesión deportiva, post-operatorio…"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <p className={helperBase}>Cuéntanos lo esencial para preparar tu sesión.</p>
      </div>

      {/* Actions */}
      <div className="grid gap-2">
        <button
          type="submit"
          className="w-full rounded-2xl bg-black px-4 py-3 text-white hover:opacity-90 active:opacity-80"
        >
          Continuar a confirmación
        </button>

        <p className="text-xs text-zinc-500 text-center">
          Al continuar, abriremos WhatsApp para confirmar tu cita con la sucursal.
        </p>
      </div>
    </form>
  );
}
