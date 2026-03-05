"use client";
import React from "react";

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

interface LessonDraggableProps {
  entry: PlannerEntry;
  onDelete: (entryId: string) => void;
}

export default function LessonDraggable({ entry, onDelete }: LessonDraggableProps) {
  return (
    <div className="flex justify-between items-center p-2 bg-zinc-100 dark:bg-zinc-700 rounded">
      <span>{entry.lesson.title}</span>
      <button
        className="text-red-500 text-sm"
        onClick={() => onDelete(entry._id)}
      >
        Delete
      </button>
    </div>
  );
}