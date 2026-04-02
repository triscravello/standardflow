// /components/standards/StandardList.tsx
import StandardCard from "./StandardCard";
import type { StandardDTO } from "@/services/standardClientService";

interface StandardListProps {
    standards: StandardDTO[];
}

export default function StandardList({ standards }: StandardListProps) {
    if (!standards.length) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                No standards found. Please add your first standard below.
            </div>
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {standards.map((standard) => (
                <StandardCard key={standard._id} standard={standard} />
            ))}
        </div>
    );
}