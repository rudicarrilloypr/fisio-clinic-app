/* eslint-disable @next/next/no-html-link-for-pages */
import { BRANCHES } from "@/lib/content/branches";
import { SERVICES } from "@/lib/content/services";
import { buildWhatsappLink, buildWhatsappText } from "@/lib/appointment/whatsapp";

const ZONE_LABELS: Record<string, string> = {
  neck: "Cuello",
  shoulder: "Hombro",
  back: "Espalda",
  low_back: "Espalda baja",
  knee: "Rodilla",
  ankle: "Tobillo",
};

type SearchParams = Record<string, string | string[] | undefined>;
type Props = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

function pick(sp: SearchParams, key: string): string {
  const v = sp[key];
  return typeof v === "string" ? v : "";
}

export default async function ConfirmPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};

  const branchId = pick(sp, "branch");
  const serviceId = pick(sp, "service");
  const date = pick(sp, "date");
  const time = pick(sp, "time");
  const name = pick(sp, "name");
  const phone = pick(sp, "phone");
  const zone = pick(sp, "zone");
  const notes = pick(sp, "notes");

  const branch = BRANCHES.find((b) => b.id === branchId) ?? BRANCHES[0];
  const service = SERVICES.find((s) => s.id === serviceId) ?? SERVICES[0];

  const zoneLabel = zone ? (ZONE_LABELS[zone] ?? zone) : undefined;

  const text = buildWhatsappText({
    clinicName: "CEFIX",
    branchName: branch.name,
    serviceName: service.name,
    date,
    time,
    patientName: name,
    patientPhone: phone,
    zoneLabel,
    notes,
  });

  const whatsappUrl = buildWhatsappLink(branch.whatsapp, text);

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-semibold">Confirmación</h1>
      <p className="mt-1 text-sm text-gray-600">Revisa los datos y confirma por WhatsApp.</p>

      <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm space-y-2">
        <div className="text-sm text-gray-600">Resumen</div>
        <div className="text-lg font-semibold">{branch.name}</div>
        <div className="text-sm">{service.name}</div>
        {zoneLabel ? <div className="text-sm">Zona: {zoneLabel}</div> : null}
        <div className="text-sm">
          {date} — {time}
        </div>
        <div className="text-sm">
          {name} — {phone}
        </div>
        {notes ? <div className="text-sm text-gray-700">Notas: {notes}</div> : null}
      </div>

      <div className="mt-4 grid gap-2">
        <a
          className="rounded-xl bg-black px-4 py-3 text-center text-white hover:opacity-90"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
        >
          💬 Confirmar por WhatsApp
        </a>

        <a className="rounded-xl border px-4 py-3 text-center hover:bg-gray-50" href="/appointment">
          Editar información
        </a>

        <a className="rounded-xl border px-4 py-3 text-center hover:bg-gray-50" href="/">
          Volver al inicio
        </a>
      </div>

      <div className="mt-4 rounded-xl border p-3">
        <p className="text-xs text-gray-500">
          Nota: En MVP el WhatsApp es placeholder. Luego conectamos números reales por sucursal.
        </p>
      </div>
    </div>
  );
}
