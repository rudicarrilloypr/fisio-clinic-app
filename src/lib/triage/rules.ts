import { BRANCHES } from "@/lib/content/branches";
import type { BodyZone } from "@/lib/content/services";
import type { CityZone } from "@/lib/content/branches";
import type { Intent, TriageResult, UrgencyLevel } from "./types";

export function routePatient(input: {
  intent: Intent;
  zone?: BodyZone;
  urgencyLevel?: UrgencyLevel;
  cityZone?: CityZone;
  suspectedServiceId?: string;
}): TriageResult {
  const disclaimer =
    "Esta evaluación no sustituye una valoración profesional. Si el dolor es intenso o empeora, acude a atención inmediata.";

  // Regla v1: si el usuario indica qué zona de la ciudad le queda mejor, derivamos a esa sucursal.
  if (input.cityZone === "near_museo") {
    return {
      intent: input.intent,
      zone: input.zone,
      urgencyLevel: input.urgencyLevel,
      cityZone: input.cityZone,
      recommendedBranchId: "cefix_museo",
      recommendedServiceId: input.suspectedServiceId,
      disclaimer,
    };
  }

  if (input.cityZone === "near_araucarias") {
    return {
      intent: input.intent,
      zone: input.zone,
      urgencyLevel: input.urgencyLevel,
      cityZone: input.cityZone,
      recommendedBranchId: "cefix_araucarias",
      recommendedServiceId: input.suspectedServiceId,
      disclaimer,
    };
  }

  // Si no se sabe zona, default a Museo (puedes cambiarlo)
  return {
    intent: input.intent,
    zone: input.zone,
    urgencyLevel: input.urgencyLevel,
    cityZone: input.cityZone ?? "unknown",
    recommendedBranchId: "cefix_museo",
    recommendedServiceId: input.suspectedServiceId,
    disclaimer,
  };
}
