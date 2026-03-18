"use client";
import React from "react";
import LessonDraggable from "./LessonDraggable";
import { PlannerEntryDTO } from "@/services/plannerClientService";

interface DayColumnProps {
  day: string;
  entries: PlannerEntryDTO[];
  onAddTask: (day: string) => void;
  onDeleteEntry: (entryId: string) => void;
}

export default function DayColumn({ day, entries, onAddTask, onDeleteEntry }: DayColumnProps) {
  return (
    <div className="flex-1 bg-white dark:bg-zinc-800 rounded-lg p-4 shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black dark:text-white">{day}</h2>
        <button 
          onClick={() => onAddTask(day)}
          className="text-sm bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700 transition"
        >
          Add Task
        </button>
      </div>
      {entries.length > 0 ? (
        <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
          {entries.map(entry => (
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