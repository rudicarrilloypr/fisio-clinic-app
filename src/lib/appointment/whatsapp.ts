import type { Branch } from "@/lib/content/branches";
import type { Service } from "@/lib/content/services";

export type AppointmentDraft = {
  name: string;
  phone: string;
  branchId: Branch["id"];
  serviceId: Service["id"];
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  zone?: string;
  notes?: string;
};

export function buildWhatsappText(args: {
  clinicName: string;
  branchName: string;
  serviceName: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  zoneLabel?: string;
  notes?: string;
}) {
  const lines = [
    `Hola 👋, quiero agendar una cita en *${args.clinicName}*.`,
    ``,
    `*Sucursal:* ${args.branchName}`,
    `*Servicio:* ${args.serviceName}`,
    args.zoneLabel ? `*Zona:* ${args.zoneLabel}` : null,
    `*Fecha:* ${args.date}`,
    `*Hora:* ${args.time}`,
    ``,
    `*Nombre:* ${args.patientName}`,
    `*Teléfono:* ${args.patientPhone}`,
    args.notes?.trim() ? `*Notas:* ${args.notes.trim()}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildWhatsappLink(phoneE164: string, text: string) {
  // For deep link
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${phoneE164}?text=${encoded}`;
}
