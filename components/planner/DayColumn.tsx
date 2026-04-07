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
  onDropEntry: (day: string) => void;
  onDragEntryStart: (entryId: string) => void;
}

export default function DayColumn({ day, entries, onAddTask, onDeleteEntry, onDragEntryStart, onDropEntry }: DayColumnProps) {
  return (
    <div className="planner-day-column" onDragOver={(event) => event.preventDefault()} onDrop={() => onDropEntry(day)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-slate-900">{day}</h2>
        <Button onClick={() => onAddTask(day)} size="sm">
          Add Task
        </Button>
      </div>
      {entries.length > 0 ? (
        <ul className="space-y-2 text-slate-600">
          {entries.map((entry) => (
            <li key={entry._id} className="flex items-start gap-2">
              <LessonDraggable entry={entry} onDelete={onDeleteEntry} onDragStart={onDragEntryStart}/>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400">No lessons scheduled</p>
      )}
    </div>
  );
}