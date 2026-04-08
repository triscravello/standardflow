// services/plannerService.ts
import PlannerEntry, { IPlannerEntry } from "../models/PlannerEntry";
import '../models/Lesson';
import type { ILesson } from "../models/Lesson";
import { Types } from "mongoose";

// Type returned to frontend after sanitization
export interface IPlannerEntryPopulated extends Omit<IPlannerEntry, "lesson"> {
  lesson: ILesson;
}

// Helper: sanitize DB entry for frontend
function sanitizeEntry(entry: IPlannerEntryPopulated): IPlannerEntryPopulated {
  return {
    ...entry,
    _id: entry._id.toString(),
    lesson: {
      ...entry.lesson,
      _id: entry.lesson._id.toString(),
    },
    date: entry.date.toISOString(),
    createdAt: entry.createdAt?.toISOString(),
    updatedAt: entry.updatedAt?.toISOString(),
    user: entry.user?.toString(),
  } as IPlannerEntryPopulated;
}

// Fetch all planner entries for a user
export async function getUserPlannerEntries(
  userId: string
): Promise<IPlannerEntryPopulated[]> {
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid userId");

  const raw = await PlannerEntry.find({ user: new Types.ObjectId(userId) })
    .populate<{ lesson: ILesson }>("lesson")
    .lean<IPlannerEntryPopulated[]>();

  // Sanitize before returning
  return raw.map(sanitizeEntry);
}

// Add a planner entry
export async function addPlannerEntry(
  userId: string,
  lessonId: string,
  date: Date
): Promise<IPlannerEntry> {
  const entry = new PlannerEntry({
    user: new Types.ObjectId(userId),
    lesson: new Types.ObjectId(lessonId),
    date,
  });

  try {
    return await entry.save();
  } catch (err: any) {
    if (err.code === 11000) {
      throw new Error(
        "Lesson already scheduled for this user on the specified date"
      );
    }
    throw err;
  }
}

// Remove planner entry
export async function removePlannerEntry(entryId: string): Promise<void> {
  await PlannerEntry.findByIdAndDelete(entryId).exec();
}

// Get planner entry by ID
export async function getPlannerEntryById(
  entryId: string
): Promise<IPlannerEntryPopulated | null> {
  const raw = await PlannerEntry.findById(entryId)
    .populate<{ lesson: ILesson }>("lesson")
    .lean<IPlannerEntryPopulated | null>();
  return raw ? sanitizeEntry(raw) : null;
}

// Reschedule planner entry
export async function reschedulePlannerEntry(
  entryId: string,
  newDate: Date
): Promise<IPlannerEntry | null> {
  return PlannerEntry.findByIdAndUpdate(entryId, { date: newDate }, { new: true })
    .lean()
    .exec();
}

// Get lessons for a single day
export async function getLessonsScheduledOnDate(
  userId: string,
  date: Date
): Promise<IPlannerEntryPopulated[]> {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const raw = await PlannerEntry.find({
    user: new Types.ObjectId(userId),
    date: { $gte: start, $lte: end },
  })
    .populate<{ lesson: ILesson }>("lesson")
    .lean<IPlannerEntryPopulated[]>();

  return raw.map(sanitizeEntry);
}

// Get entries for a week
export async function getPlannerEntriesForWeek(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<IPlannerEntryPopulated[]> {
  const raw = await PlannerEntry.find({
    user: new Types.ObjectId(userId),
    date: { $gte: startDate, $lte: endDate },
  })
    .populate<{ lesson: ILesson }>("lesson")
    .lean<IPlannerEntryPopulated[]>();

  return raw.map(sanitizeEntry);
}

// Get lessons for a specific unit in a week
export async function getUnitLessonsForWeek(
  userId: string,
  unitId: string,
  startDate: Date,
  endDate: Date
): Promise<IPlannerEntryPopulated[]> {
  const raw = await PlannerEntry.find({
    user: new Types.ObjectId(userId),
    date: { $gte: startDate, $lte: endDate },
  })
    .populate<{ lesson: ILesson }>({
      path: "lesson",
      match: { unit: new Types.ObjectId(unitId) },
    })
    .lean<IPlannerEntryPopulated[]>();

  // Filter out entries where lesson didn't match
  return raw.filter((e) => e.lesson).map(sanitizeEntry);
}

// Clear all planner entries for a user
export async function clearUserPlanner(userId: string): Promise<void> {
  await PlannerEntry.deleteMany({ user: new Types.ObjectId(userId) }).exec();
}