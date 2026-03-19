// services/lessonClientService.ts
export interface LessonDTO {
    _id: string;
    title: string;
    standard: string;
    objectives: string[];
    materials: string[];
}

export interface CreateLessonPayload {
    title: string;
    standardId: string;
    objectives?: string[];
    materials?: string[];
}

async function parseJson<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `Request failed with status ${res.status}`);
    }

    return res.json() as Promise<T>;
}

export const lessonService = {
    async getLessons(): Promise<LessonDTO[]> {
        const res = await fetch('/api/lessons', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        return parseJson<LessonDTO[]>(res);
    },

    async createLesson(payload: CreateLessonPayload): Promise<LessonDTO> {
        const res = await fetch('/api/lessons', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return parseJson<LessonDTO>(res);
    }
}