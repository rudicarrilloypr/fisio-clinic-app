export type CityZone = "near_museo" | "near_araucarias" | "unknown";

export type Branch = {
  id: "cefix_museo" | "cefix_araucarias";
  name: string;
  address: string;
  hours: string;
  whatsapp: string; // placeholder en v1
  mapsUrl: string;
  coverage: CityZone[]; // para derivación por zona
};

export const BRANCHES: Branch[] = [
  {
    id: "cefix_museo",
    name: "Sucursal CEFIX Museo",
    address: "C. Santiago Bonilla 410, Obrero Campesina, 91020 Xalapa-Enríquez, Ver.",
    hours: "Lun–Vie 9:30–21:30 | Sáb 9:30–14:00",
    whatsapp: "+522281031548",
    mapsUrl:
      "https://maps.app.goo.gl/zFtwCcvpyEiJjH8VA",
    coverage: ["near_museo", "unknown"],
  },
  {
    id: "cefix_araucarias",
    name: "Sucursal CEFIX Araucarias",
    address: "Av. Araucarias 193-piso 2, Indeco Animas, 91190 Xalapa-Enríquez, Ver.",
    hours: "Lun–Vie 9:00–20:30 | Sáb 10:30–15:00",
    whatsapp: "+522281031548",
    mapsUrl: "https://maps.google.com/?q=CEFIX+Araucarias",
    coverage: ["near_araucarias", "unknown"],
  },
];

