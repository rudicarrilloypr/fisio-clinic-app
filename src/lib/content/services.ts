export type BodyZone = "neck" | "shoulder" | "back" | "low_back" | "knee" | "ankle";

export type Service = {
  id: string;
  name: string;
  description: string;
  zones: BodyZone[];
};

export const SERVICES: Service[] = [
  {
    id: "sports",
    name: "Fisioterapia Deportiva",
    description: "Evaluación y tratamiento para lesiones por actividad física.",
    zones: ["knee", "ankle", "shoulder", "back"],
  },
  {
    id: "spine",
    name: "Rehabilitación de Columna",
    description: "Tratamiento para dolor cervical y lumbar, postura y movilidad.",
    zones: ["neck", "low_back", "back"],
  },
  {
    id: "postop",
    name: "Rehabilitación Post-operatoria",
    description: "Recuperación guiada después de cirugía para volver a tu actividad.",
    zones: ["knee", "shoulder", "ankle"],
  },
];
