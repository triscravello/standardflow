"use client";
import React, { useEffect, useState } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import DayColumn from "./DayColumn";

interface Lesson {
  _id: string;
  title: string;
}

interface PlannerEntry {
  _id: string;
  lesson: Lesson;
  date: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

const USER_ID = "USER_ID_HERE";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WeeklyPlanner() {
  const [planner, setPlanner] = useState<Record<string, PlannerEntry[]>>({});
  const [loading, setLoading] = useState(true);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  // Fetch planner entries from API
  useEffect(() => {
    async function fetchPlanner() {
      try {
        const res = await fetch(
          `/api/planner/week?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}`
        );
        const data = await res.json();

        const grouped: Record<string, PlannerEntry[]> = {};
        data.entries.forEach((entry: PlannerEntry) => {
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
  }, [weekStart, weekEnd]);

  // Add a lesson
  const addTask = async (day: string) => {
    const lessonTitle = prompt(`Add lesson for ${day}`);
    if (!lessonTitle) return;

    const date = new Date(weekStart);
    const dayIndex = daysOfWeek.indexOf(day);
    date.setDate(date.getDate() + dayIndex);

    try {
      const res = await fetch("/api/planner/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, lessonTitle, date }),
      });
      const newEntry: PlannerEntry = await res.json();

      setPlanner(prev => ({
        ...prev,
        [day]: [...(prev[day] || []), newEntry],
      }));
    } catch (err) {
      console.error("Failed to add entry:", err);
    }
  };

  // Delete a lesson
  const deleteEntry = async (entryId: string) => {
    try {
      await fetch(`/api/planner/week?lessonId=${entryId}`, { method: "DELETE" });

      const updated: Record<string, PlannerEntry[]> = {};
      for (const day of daysOfWeek) {
        updated[day] = (planner[day] || []).filter(e => e._id !== entryId);
      }
      setPlanner(updated);
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading planner...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-7xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-black dark:text-white">
          Weekly Planner
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
          {daysOfWeek.map(day => (
            <DayColumn
              key={day}
              day={day}
              entries={planner[day] || []}
              onAddTask={addTask}
              onDeleteEntry={deleteEntry}
            />
          ))}
        </div>
      </div>
    </div>
  );
}