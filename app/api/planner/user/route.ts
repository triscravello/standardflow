// /app/api/planner/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { getUserPlannerEntries } from "@/services/plannerService";
import { unauthorized, forbidden, internalServerError } from "@/utils/apiErrors";
import { connectDB } from "@/lib/mongodb";

type PlannerEntryLike = {
    _id: { toString: () => string };
    lesson: {
        _id: { toString: () => string };
        title: string;
    };
    date: Date | string;
    user?: { toString: () => string };
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

function sanitizeEntry(entry: PlannerEntryLike) {
    return {
        _id: entry._id.toString(),
        lesson: {
            _id: entry.lesson._id.toString(),
            title: entry.lesson.title,
        },
        date: new Date(entry.date).toISOString(),
        user: entry.user?.toString(),
        createdAt: entry.createdAt ? new Date(entry.createdAt).toISOString() : undefined,
        updatedAt: entry.updatedAt ? new Date(entry.updatedAt).toISOString() : undefined,
    }
}

export async function GET(req: NextRequest) {
    try{
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);

        await connectDB();
        const plannerEntries = await getUserPlannerEntries(user.id);

        return NextResponse.json(plannerEntries.map(sanitizeEntry));
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return unauthorized();
        }

        return internalServerError();
    }
}