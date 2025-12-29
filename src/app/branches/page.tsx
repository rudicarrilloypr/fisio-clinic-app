import { BRANCHES } from "@/lib/content/branches";

export default function BranchesPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-semibold">Sucursales</h1>
      <p className="mt-1 text-sm text-gray-600">Elige la sucursal que te quede más cerca.</p>

      <div className="mt-4 space-y-3">
        {BRANCHES.map((b) => (
          <div key={b.id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-lg font-semibold">{b.name}</div>
            <div className="mt-1 text-sm text-gray-700">{b.address}</div>
            <div className="mt-1 text-xs text-gray-500">{b.hours}</div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <a
                className="rounded-xl border px-4 py-3 text-center hover:bg-gray-50"
                href={b.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                📍 Ver ubicación
              </a>

              <a
                className="rounded-xl bg-black px-4 py-3 text-center text-white hover:opacity-90"
                href={`/appointment?branch=${encodeURIComponent(b.id)}`}
              >
                📅 Agendar en esta sucursal
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
