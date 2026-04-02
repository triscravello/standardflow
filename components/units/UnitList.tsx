// /component/units/UnitList.tsx
import UnitCard from "./UnitCard";
import type { UnitDTO } from "@/services/unitClientService";

interface UnitListProps {
    units: UnitDTO[];
}

export default function UnitList({ units }: UnitListProps) {
    if (!units.length) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                No units created.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {units.map((unit) => (
                <UnitCard key={unit._id} unit={unit} />
            ))}
        </div>
    )
}