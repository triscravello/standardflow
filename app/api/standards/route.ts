// /app/api/standards/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { getStandards, createStandard } from "@/services/standardService";
import {
  forbidden,
  badRequest,
  internalServerError,
} from "@/utils/apiErrors";
import dbConnect from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    requireRole(user, ["admin", "teacher", "viewer"]);

    const standards = await getStandards();
    return NextResponse.json({ success: true, data: standards });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return forbidden();
    }
    return internalServerError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    requireRole(user, ["admin"]); // ADMIN ONLY

    const body = await req.json();
    const { code, description, subject, gradeLevel } = body;

    if (!code || !description || !subject || !gradeLevel === undefined) {
      return badRequest("Code, description, subject, and gradeLevel are required");
    }

    const standard = await createStandard(body);
    await dbConnect();

    return NextResponse.json(
      { success: true, data: standard },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return forbidden();
    }
    console.error("POST /api/standards ERROR:", error);
    if (error instanceof Error && error.message === "FORBIDDEN") return forbidden();
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
