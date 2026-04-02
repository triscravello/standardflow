// components/lessons/LessonList.tsx

import LessonCard from './LessonCard';
import type { LessonDTO } from '@/services/lessonClientService';

interface LessonListProps {
    lessons: LessonDTO[];
}

export default function LessonList({ lessons }: LessonListProps) {
    if (!lessons.length) {
        return (
            <div className='rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600'>
                No lessons yet.
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