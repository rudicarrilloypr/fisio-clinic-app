import { VIDEOS } from "@/lib/content/videos";

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-semibold">Videos</h1>
      <p className="mt-1 text-sm text-gray-600">Ejercicios por zona del cuerpo.</p>

      <div className="mt-4 space-y-3">
        {VIDEOS.map((v) => (
          <div key={v.id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-600">{v.zone}</div>
            <div className="text-lg font-semibold">{v.title}</div>
            <a className="mt-2 inline-block rounded-xl border px-3 py-2 hover:bg-gray-50" href={v.url} target="_blank" rel="noreferrer">
              Ver video
            </a>
            <p className="mt-2 text-xs text-gray-500">{v.warning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
