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

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-zinc-900">{value}</div>
    </div>
  );
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
    <div className="mx-auto max-w-2xl">
      {/* Header / Step */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Confirmación</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Revisa los datos. Al confirmar, abriremos WhatsApp con el mensaje listo para enviar.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="rounded-full border px-3 py-1 text-xs text-zinc-600">
              1 Datos
            </span>
            <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
              2 Confirmación
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Resumen
          </div>
          <div className="text-xs text-zinc-500">CEFIX</div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Sucursal" value={branch?.name} />
          <Field label="Servicio" value={service?.name} />
          <Field label="Fecha" value={date || ""} />
          <Field label="Hora" value={time || ""} />
          <Field label="Paciente" value={name || ""} />
          <Field label="Teléfono" value={phone || ""} />
        </div>

        {zoneLabel ? (
          <div className="mt-3 rounded-2xl border bg-zinc-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Zona
            </div>
            <div className="mt-1 text-sm font-medium text-zinc-900">{zoneLabel}</div>
          </div>
        ) : null}

        {notes ? (
          <div className="mt-3 rounded-2xl border bg-zinc-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Notas
            </div>
            <div className="mt-1 text-sm text-zinc-800 whitespace-pre-wrap">{notes}</div>
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div className="mt-4 grid gap-2">
        <a
          className="rounded-2xl bg-black px-4 py-3 text-center text-white hover:opacity-90 active:opacity-80"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
        >
          💬 Confirmar por WhatsApp
        </a>

        <div className="grid gap-2 sm:grid-cols-2">
          <a
            className="rounded-2xl border bg-white px-4 py-3 text-center hover:bg-zinc-50"
            href="/appointment"
          >
            Editar información
          </a>

          <a
            className="rounded-2xl border bg-white px-4 py-3 text-center hover:bg-zinc-50"
            href="/"
          >
            Volver al inicio
          </a>
        </div>
      </div>

      {/* Note */}
      <div className="mt-4 rounded-2xl border bg-white p-4">
        <p className="text-xs text-zinc-500">
          Nota: En MVP el WhatsApp es placeholder. Luego conectamos números reales por sucursal.
        </p>
      </div>
    </div>
  );
}
