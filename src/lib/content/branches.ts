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
    address: "Dirección pendiente",
    hours: "Lun–Vie 9:00–19:00 | Sáb 9:00–14:00",
    whatsapp: "5210000000000",
    mapsUrl: "https://maps.google.com/?q=CEFIX+Museo",
    coverage: ["near_museo", "unknown"],
  },
  {
    id: "cefix_araucarias",
    name: "Sucursal CEFIX Araucarias",
    address: "Dirección pendiente",
    hours: "Lun–Vie 9:00–19:00 | Sáb 9:00–14:00",
    whatsapp: "5210000000000",
    mapsUrl: "https://maps.google.com/?q=CEFIX+Araucarias",
    coverage: ["near_araucarias", "unknown"],
  },
];
