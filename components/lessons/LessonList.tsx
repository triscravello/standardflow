// components/lessons/LessonList.tsx

import LessonCard from './LessonCard';
import type { LessonDTO } from '@/services/lessonClientService';

interface LessonListProps {
    lessons: LessonDTO[];
}

export default function LessonList({ lessons }: LessonListProps) {
    if (!lessons.length) {
        return (
            <div className='rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400'>
                No lessons yet. Add your first lesson below.
            </div>
        );
    }

    return (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {lessons.map((lesson) => (
                <LessonCard key={lesson._id} lesson={lesson} />
            ))}
        </div>
    );
}