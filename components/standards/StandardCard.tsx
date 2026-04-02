// /components/standards/StandardCard.tsx
import type { StandardDTO } from "@/services/standardClientService";


interface StandardCardProps {
    standard: StandardDTO;
}

export default function StandardCard({ standard }: StandardCardProps) {
    return (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-slate-900">{standard.code}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    Grade {standard.gradeLevel}
                </span>
            </div>

            <p className="mt-3 text-sm text-slate-600">{standard.description}</p>

            <p className="mt-4 text-sm text-slate-600">
                Subject: <span className="font-medium">{standard.subject}</span>
            </p>
        </article>
    );
}