// /app/api/planner/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { getUserPlannerEntries } from "@/services/plannerService";
import { unauthorized, forbidden, internalServerError } from "@/utils/apiErrors";
import { connectDB } from "@/lib/mongodb";

type PlannerEntryLike = {
  _id: string;
  lesson: {
    _id: string;
    title: string;
  };
  date: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Convert DB entry to sanitized JSON-safe format
function sanitizeEntry(entry: any): PlannerEntryLike {
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
  };
}

export async function GET(req: NextRequest) {
  try {
    console.log("🚀 GET /api/planner/user hit");

    // 1️⃣ Authenticate user
    const user = await requireAuth(req);
    if (!user) {
      console.warn("Unauthorized: No user session");
      return unauthorized();
    }

    // 2️⃣ Authorize role
    try {
      requireRole(user, ["admin", "teacher"]);
    } catch {
      console.warn("Forbidden: User does not have required role");
      return forbidden();
    }

    // 3️⃣ Connect to database
    try {
      await connectDB();
    } catch (dbConnError) {
      console.error("DB connection failed:", dbConnError);
      return internalServerError();
    }

    // 4️⃣ Fetch planner entries
    if (!user.id) {
      console.warn("User ID missing");
      return unauthorized();
    }

    let plannerEntriesRaw: any[] = [];
    try {
      plannerEntriesRaw = await getUserPlannerEntries(user.id);
    } catch (dbQueryError) {
      console.error("DB query failed:", dbQueryError);
      return internalServerError();
    }

    // 5️⃣ Sanitize and return
    const sanitized: PlannerEntryLike[] = plannerEntriesRaw.map(sanitizeEntry);
    return NextResponse.json({ success: true, data: sanitized });
  } catch (error) {
    console.error("🔥 Unexpected error in /api/planner/user:", error);
    return internalServerError();
  }
}