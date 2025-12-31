import { SERVICES } from "@/lib/content/services";

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-semibold">Servicios</h1>
      <div className="mt-4 space-y-3">
        {SERVICES.map((s) => (
          <div key={s.id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{s.name}</h2>
            <p className="mt-1 text-sm text-gray-700">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
