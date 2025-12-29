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
    <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-4 shadow-sm space-y-4">
      <div className="rounded-xl border p-3">
        <p className="text-sm text-gray-600">Contexto</p>
        <p className="mt-1 text-sm">
          {props.initialZone ? (
            <>
              Zona seleccionada: <span className="font-medium">{zoneLabel}</span>
              {filteredServices.length !== services.length && filteredServices.length > 0 ? (
                <span className="text-gray-500"> (servicios filtrados por zona)</span>
              ) : null}
            </>
          ) : (
            <>Sin zona seleccionada (ok para MVP).</>
          )}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Sucursal</label>
          <select
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value as Branch["id"])}
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">{selectedBranch?.hours}</p>
        </div>

        <div>
          <label className="text-sm font-medium">Servicio</label>
          <select
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value as Service["id"])}
          >
            {servicePool.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">{selectedService?.description}</p>

          {services.length === 0 ? (
            <p className="mt-1 text-xs text-red-600">
              No hay servicios cargados aún (placeholder). Revisa src/lib/content/services.ts
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Fecha preferida</label>
          <input
            type="date"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Hora preferida</label>
          <input
            type="time"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Teléfono</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="Tu teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Notas (opcional)</label>
        <textarea
          className="mt-1 w-full rounded-xl border px-3 py-2"
          placeholder="Ej. dolor desde hace 3 días, hice deporte, etc."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button type="submit" className="w-full rounded-xl bg-black px-4 py-3 text-white hover:opacity-90">
        Continuar a confirmación
      </button>
    </form>
  );
}
