"use client";
import React from "react";
import LessonDraggable from "./LessonDraggable";
import { PlannerEntryDTO } from "@/services/plannerClientService";
import Button from "../common/Button";

interface DayColumnProps {
  day: string;
  entries: PlannerEntryDTO[];
  onAddTask: (day: string) => void;
  onDeleteEntry: (entryId: string) => void;
}

export default function DayColumn({ day, entries, onAddTask, onDeleteEntry }: DayColumnProps) {
  return (
    <div className="planner-day-column">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-black dark:text-white">{day}</h2>
        <Button onClick={() => onAddTask(day)} size="sm">
          Add Task
        </Button>
      </div>
      {entries.length > 0 ? (
        <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
          {entries.map((entry) => (
            <li key={entry._id} className="flex items-start gap-2">
              <LessonDraggable entry={entry} onDelete={onDeleteEntry} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-zinc-400 dark:text-zinc-500">No lessons scheduled</p>
      )}
    </div>
  );
}