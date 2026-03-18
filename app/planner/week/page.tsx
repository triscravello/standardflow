// /app/planner/week/page.tsx
import WeeklyPlanner from "@/components/planner/WeeklyPlanner";
import { PlannerEntryDTO } from "@/services/plannerClientService";

const mvpPlannerSeed: PlannerEntryDTO[] = [
    {
        _id: "seed-lesson-1",
        lesson: {
            _id: "seed-l1",
            title: "Intro to Fractions",
        },
        date: "2026-03-16T00:00:00.000Z",
    },
    {
        _id: "seed-lesson-2",
        lesson: {
            _id: "seed-l2",
            title: "Reading Comprehension: Short Stories",
        },
        date: "2026-03-18T00:00:00.000Z",
    },
    {
        _id: "seed-lesson-3",
        lesson: {
            _id: "seed-l3",
            title: "Plant Cell Lab Prep",
        },
        date: "2026-03-20T00:00:00.000Z",
    },
]

export default function WeeklyPlansPage() {
    return (
        <WeeklyPlanner initialEntries={mvpPlannerSeed}/>
    )
}