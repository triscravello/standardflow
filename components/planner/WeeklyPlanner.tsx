"use client";
import React, { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import DayColumn from "./DayColumn";
import {
  plannerService,
  PlannerEntryDTO,
} from "@/services/plannerClientService";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function toPlannerByDay(entries: PlannerEntryDTO[]) {
  const grouped: Record<string, PlannerEntryDTO[]> = {};

  for (const day of daysOfWeek) {
    grouped[day] = [];
  }

  for (const entry of entries) {
    const dayName = format(new Date(entry.date), "EEEE");
    if (grouped[dayName]) {
      grouped[dayName].push(entry);
    }
  }

  return grouped;
}

export default function WeeklyPlanner({ initialEntries = [] }: { initialEntries?: PlannerEntryDTO[] }) {
  const [planner, setPlanner] = useState<Record<string, PlannerEntryDTO[]>>(
    toPlannerByDay(initialEntries)
  );
  const [isSyncing, setIsSyncing] = useState(false);

  const hasPlannerEntries = useMemo(
    () => Object.values(planner).some(entries => entries.length > 0),
    [planner]
  );

  useEffect(() => {
    async function fetchPlanner() {
      try {
        const entries = await plannerService.user();
        setPlanner(toPlannerByDay(entries));
      } catch (error) {
        console.error("Error fetching planner user entries:", error);
      } finally {
        setIsSyncing(false);
      }
    }

    fetchPlanner();
  }, []);

  const addTask = async (day: string) => {
    const lessonTitle = prompt(`Add lesson for ${day}`);
    if (!lessonTitle) return;

    const optimisticEntry: PlannerEntryDTO = {
      _id: `temp-${Date.now()}`,
      lesson: {
        _id: "tmp-lesson",
        title: lessonTitle,
      },
      date: new Date().toISOString(),
    };

    setPlanner(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), optimisticEntry],
    }));
  };

  const deleteEntry = async (entryId: string) => {
    setPlanner(prev => {
      const next: Record<string, PlannerEntryDTO[]> = {};
      for (const day of daysOfWeek) {
        next[day] = prev[day].filter(entry => entry._id !== entryId);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-7xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-black dark:text-white">
          Weekly Planner
        </h1>
        <p className="text-center text-zinc-500 dark:text-zinc-400 mb-10">
          {isSyncing
            ? "Syncing planner entries..."
            : hasPlannerEntries
              ? "Drag and drop lessons to organize your week!"
              : "No planner entries yet this week."}
        </p>

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