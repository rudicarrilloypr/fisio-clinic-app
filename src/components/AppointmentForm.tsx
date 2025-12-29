"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Branch } from "@/lib/content/branches";
import type { Service } from "@/lib/content/services";

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
  initialZone?: string;
  branches: Branch[];
  services: Service[];
}) {
  const router = useRouter();

  const [branchId, setBranchId] = useState<Branch["id"]>(props.initialBranchId);
  const [serviceId, setServiceId] = useState<Service["id"]>(
    props.services[0]?.id ?? "sports"
  );

  const [date, setDate] = useState<string>(todayISO());
  const [time, setTime] = useState<string>("10:00");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const zoneLabel = useMemo(() => {
    if (!props.initialZone) return "";
    return ZONE_LABELS[props.initialZone] ?? props.initialZone;
  }, [props.initialZone]);

  const selectedBranch = props.branches.find((b) => b.id === branchId);
  const selectedService = props.services.find((s) => s.id === serviceId);

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
            {props.branches.map((b) => (
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
            {props.services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">{selectedService?.description}</p>
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

      <button
        type="submit"
        className="w-full rounded-xl bg-black px-4 py-3 text-white hover:opacity-90"
      >
        Continuar a confirmación
      </button>
    </form>
  );
}
