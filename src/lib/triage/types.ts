import type { BodyZone } from "@/lib/content/services";
import type { CityZone } from "@/lib/content/branches";

export type Intent = "urgency" | "appointment";
export type UrgencyLevel = "high" | "medium" | "low";

export type TriageResult = {
  intent: Intent;
  zone?: BodyZone;
  urgencyLevel?: UrgencyLevel;

  // nuevo: para derivar por ubicación
  cityZone?: CityZone;

  recommendedBranchId: "cefix_museo" | "cefix_araucarias";
  recommendedServiceId?: string;

  disclaimer: string;
};
