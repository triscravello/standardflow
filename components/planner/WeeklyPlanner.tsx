"use client";
import React, { FormEvent, useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import DayColumn from "./DayColumn";
import {
  plannerService,
  PlannerEntryDTO,
} from "@/services/plannerClientService";
import Modal from "../common/Modal";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";

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
  const [isSyncing, setIsSyncing] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");

  const hasPlannerEntries = useMemo(
    () => Object.values(planner).some((entries) => entries.length > 0),
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

    void fetchPlanner();
  }, []);

  const openAddTaskModal = (day: string) => {
    setSelectedDay(day);
    setNewLessonTitle("");
    setIsAddModalOpen(true);
  };

  const addTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedDay || !newLessonTitle.trim()) {
      return;
    }

    const optimisticEntry: PlannerEntryDTO = {
      _id: `temp-${Date.now()}`,
      lesson: {
        _id: "tmp-lesson",
        title: newLessonTitle.trim(),
      },
      date: new Date().toISOString(),
    };

    setPlanner((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), optimisticEntry],
    }));

    setIsAddModalOpen(false);
    setNewLessonTitle("");
  };

  const deleteEntry = async (entryId: string) => {
    setPlanner((prev) => {
      const next: Record<string, PlannerEntryDTO[]> = {};
      for (const day of daysOfWeek) {
        next[day] = prev[day].filter((entry) => entry._id !== entryId);
      }
      return next;
    });
  };

  return (
    <div className="planner-page">
      <div className="planner-container">
        <h1 className="planner-title">
          Weekly Planner
        </h1>
        <p className="planner-subtitle">
          {isSyncing
            ? "Syncing planner entries..."
            : hasPlannerEntries
              ? "Drag and drop lessons to organize your week!"
              : "No planner entries yet this week."}
        </p>

        {isSyncing ? (
          <div className="flex justify-center py-6">
            <LoadingSpinner label="Syncing planner entries..." />
          </div>
        ) : (
          <div className="planner-grid">
            {daysOfWeek.map((day) => (
              <DayColumn
                key={day}
                day={day}
                entries={planner[day] || []}
                onAddTask={openAddTaskModal}
                onDeleteEntry={deleteEntry}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        title={selectedDay ? `Add Lesson to ${selectedDay}` : "Add Lesson"}
        onClose={() => setIsAddModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="add-lesson-form" disabled={!newLessonTitle.trim()}>
              Save Lesson
            </Button>
          </>
        }
      >
        <form id="add-planner-lesson-form" onSubmit={addTask} className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200" htmlFor="lesson-title">
            Lesson title
          </label>
          <input
            id="planner-lesson-title"
            value={newLessonTitle}
            onChange={(event) => setNewLessonTitle(event.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            placeholder="Ex: Intro to Fractions"
          />
        </form>
      </Modal>
    </div>
  );
}