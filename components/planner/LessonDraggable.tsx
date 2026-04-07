"use client";
import React from "react";
import { format } from "date-fns";
import { PlannerEntryDTO } from "@/services/plannerClientService";
import Button from "../common/Button";

interface LessonDraggableProps {
  entry: PlannerEntryDTO;
  onDelete: (entryId: string) => void;
  onDragStart: (entryId: string) => void;
}

export default function LessonDraggable({ entry, onDelete, onDragStart }: LessonDraggableProps) {
  return (
    <div 
      draggable
      onDragStart={() => onDragStart(entry._id)} 
      className="w-full flex justify-between items-center p-2 bg-zinc-100 dark:bg-zinc-700 rounded gap-2 cursor-move"
    >
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{entry.lesson.title}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-300">
          {format(new Date(entry.date), "MMM d")}
        </p>
      </div>
      <Button
        size="sm"
        className="text-red-500 hover:text-red-600"
        onClick={() => onDelete(entry._id)}
        variant="ghost"
      >
        Delete
      </Button>
    </div>
  );
}