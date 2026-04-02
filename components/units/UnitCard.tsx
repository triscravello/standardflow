// components/units/UnitCard.tsx
import UnitLessonManager from "./UnitLessonManager";
import type { UnitDTO } from "@/services/unitClientService";

interface UnitCardProps {
    unit: UnitDTO;
}

export default function UnitCard({ unit }: UnitCardProps) {
    const startDate = new Date(unit.startDate).toLocaleDateString();
    const endDate = new Date(unit.endDate).toLocaleDateString();

    return (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{unit.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                        Grade level: <span className="font-medium">{unit.gradeLevel}</span>
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                        Duration: <span className="font-medium">{startDate}</span> - <span className="font-medium">{endDate}</span>
                    </p>
                </div>
            </div>

            <div className="mt-5 border-t border-slate-200 pt-5">
                <UnitLessonManager unitId={unit._id} />
            </div>
        </article>
    )
}