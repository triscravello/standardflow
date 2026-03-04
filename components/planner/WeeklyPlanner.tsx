// /components/planner/WeeklyPlanner.tsx
"use client";
import React, { useState, useEffect } from "react";
import { getPlannerEntriesForWeek, addPlannerEntry, IPlannerEntryPopulated } from "@/services/plannerService";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { Types } from "mongoose";

// Example: Replace with actual logged-in user ID
const USER_ID = "USER_ID_HERE";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function WeeklyPlanner() {
  const [planner, setPlanner] = useState<Record<string, IPlannerEntryPopulated[]>>({});
  const [loading, setLoading] = useState(true);

  // Compute current week's start/end
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }); // Sunday

  // Fetch planner entries for the current week
  useEffect(() => {
    async function fetchPlanner() {
      try {
        const entries = await getPlannerEntriesForWeek(USER_ID, weekStart, weekEnd);
        // Group by day name
        const grouped: Record<string, IPlannerEntryPopulated[]> = {};
        entries.forEach(entry => {
          const dayName = format(new Date(entry.date), "EEEE");
          if (!grouped[dayName]) grouped[dayName] = [];
          grouped[dayName].push(entry);
        });
        setPlanner(grouped);
      } catch (err) {
        console.error("Failed to fetch planner:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlanner();
  }, []);

  // Add new planner entry
  const addTask = async (day: string) => {
    const lessonTitle = prompt(`Add a lesson for ${day}`);
    if (!lessonTitle) return;

    try {
      // For MVP: we can create a "dummy lesson" or select existing lesson
      const lessonId = "DUMMY_LESSON_ID"; // Replace with real selection in production
      const date = new Date(weekStart);
      const dayIndex = daysOfWeek.indexOf(day);
      date.setDate(date.getDate() + dayIndex);

      const newEntry = await addPlannerEntry(USER_ID, lessonId, date);

      // Build a TypeScript-safe IPlannerEntryPopulated (cast because ILesson is a Mongoose document type)
      const populatedEntry = {
        _id: newEntry._id,
        user: newEntry.user,
        date: newEntry.date,
        lesson: {
            _id: new Types.ObjectId(lessonId),
            title: lessonTitle,
            standard: new Types.ObjectId(), // Placeholder
            objectives: [],
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: new Types.ObjectId(USER_ID),
        }
      } as unknown as IPlannerEntryPopulated;

      setPlanner(prev => ({
        ...prev,
        [day]: [...(prev[day] || []), populatedEntry],
      }));
    } catch (err) {
      console.error("Failed to add planner entry:", err);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading planner...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-black dark:text-white">
          Weekly Planner
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {daysOfWeek.map(day => (
            <div
              key={day}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">{day}</h2>

                {planner[day]?.length ? (
                  <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                    {planner[day].map(entry => (
                      <li key={entry._id.toString()} className="flex items-start gap-2">
                        <span className="mt-1 w-2 h-2 bg-indigo-500 rounded-full" />
                        {entry.lesson.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-400 dark:text-zinc-500">No lessons scheduled</p>
                )}
              </div>

              <button
                onClick={() => addTask(day)}
                className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition"
              >
                Add Lesson
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}