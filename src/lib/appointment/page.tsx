import { BRANCHES } from "@/lib/content/branches";
import { SERVICES } from "@/lib/content/services";
import AppointmentForm from "@/components/AppointmentForm";

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function AppointmentPage({ searchParams }: Props) {
  const branchParam = typeof searchParams?.branch === "string" ? searchParams?.branch : undefined;
  const zoneParam = typeof searchParams?.zone === "string" ? searchParams?.zone : undefined;

  const branchExists = branchParam && BRANCHES.some((b) => b.id === branchParam);
  const initialBranchId = (branchExists ? branchParam : BRANCHES[0]?.id) as
    | "cefix_museo"
    | "cefix_araucarias";

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-semibold">Agendar cita</h1>
      <p className="mt-1 text-sm text-gray-600">
        Completa tus datos y te llevamos a confirmar por WhatsApp.
      </p>

      <div className="mt-4">
        <AppointmentForm
          initialBranchId={initialBranchId}
          initialZone={zoneParam}
          branches={BRANCHES}
          services={SERVICES}
        />
      </div>
    </div>
  );
}
