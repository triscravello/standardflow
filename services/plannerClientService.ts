// services/plannerClientService.ts

export interface PlannerLesson {
    _id: string;
    title: string;
}

export interface PlannerEntryDTO {
    _id: string;
    lesson: PlannerLesson;
    date: string; // ISO string
    user?: string;
    createdAt?: string;
    updatedAt?: string;
}

async function parseJson<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `Request failed with status ${res.status}`);
    }

    return res.json() as Promise<T>;
}

export const plannerService = {
    async user(): Promise<PlannerEntryDTO[]> {
        const res = await fetch('/api/planner/user', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return parseJson<PlannerEntryDTO[]>(res);
    },

    async create(lessonId: string, date: string): Promise<PlannerEntryDTO> {
        const res = await fetch('/api/planner/week', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lessonId, date }),
        });

        return parseJson<PlannerEntryDTO>(res);
    },

    async remove(entryId: string): Promise<void> {
        const res = await fetch(`/api/planner/week?entryId=${encodeURIComponent(entryId)}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        await parseJson<{ message: string }>(res);
    },

    async reschedule(entryId: string, newDate: string): Promise<PlannerEntryDTO> {
        const res = await fetch('/api/planner/week', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entryId, newDate }),
        });

        return parseJson<PlannerEntryDTO>(res);
    }
};