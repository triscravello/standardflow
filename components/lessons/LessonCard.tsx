import { LessonDTO } from "@/services/lessonClientService";

interface LessonCardProps {
    lesson: LessonDTO;
}

export default function LessonCard({ lesson }: LessonCardProps) {
    return (
        <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{lesson.title}</h3>

            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Standard: <span className="font-medium">{lesson.standard}</span>
            </p>

            {lesson.objectives.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Objectives</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                        {lesson.objectives.map((objective) => (
                            <li key={objective}>{objective}</li>
                        ))}
                    </ul>
                </div>
            )}
        </article>
    );
}