import type { BodyZone } from "@/lib/content/services";
import type { CityZone } from "@/lib/content/branches";
import type { Intent, TriageResult, UrgencyLevel } from "./types";

function suggestServiceId(zone?: BodyZone): string | undefined {
  if (!zone) return undefined;

  // MVP mapping:
  // - Columna/cervical -> spine
  // - Extremidades / deportivo -> sports
  if (zone === "neck" || zone === "back" || zone === "low_back") return "spine";
  if (zone === "knee" || zone === "ankle" || zone === "shoulder") return "sports";

  return undefined;
}
export function routePatient(input: {
  intent: Intent;
  zone?: BodyZone;
  urgencyLevel?: UrgencyLevel;
  cityZone?: CityZone;
  suspectedServiceId?: string;
}): TriageResult {
  const disclaimer =
    "Esta evaluación no sustituye una valoración profesional. Si el dolor es intenso o empeora, acude a atención inmediata.";

  // If caller already passed a suspected service (future), respect it.
  const recommendedServiceId = input.suspectedServiceId ?? suggestServiceId(input.zone);

  // Derivación por zona de ciudad
  if (input.cityZone === "near_museo") {
    return {
      intent: input.intent,
      zone: input.zone,
      urgencyLevel: input.urgencyLevel,
      cityZone: input.cityZone,
      recommendedBranchId: "cefix_museo",
      recommendedServiceId,
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
      recommendedServiceId,
      disclaimer,
    };
  }

  // Default
  return {
    intent: input.intent,
    zone: input.zone,
    urgencyLevel: input.urgencyLevel,
    cityZone: input.cityZone ?? "unknown",
    recommendedBranchId: "cefix_museo",
    recommendedServiceId,
    disclaimer,
  };
}
