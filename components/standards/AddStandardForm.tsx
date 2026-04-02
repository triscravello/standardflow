'use client';

import { FormEvent, useState } from "react";
import type { StandardDTO } from "@/services/standardClientService";
import Button from "../common/Button";

interface AddStandardFormProps {
    onAddStandard: (standard: Omit<StandardDTO, '_id'>) => Promise<void>;
}

export default function AddStandardForm({ onAddStandard }: AddStandardFormProps) {
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const parsedGradeLevel = Number(gradeLevel);

        if (!code.trim() || !description.trim() || !subject.trim() || Number.isNaN(parsedGradeLevel)) {
            setError('Please fill in all fields with valid values.');
            return;
        }

        setIsSubmitting(true);

        try {
            await onAddStandard({
                code: code.trim().toUpperCase(),
                description: description.trim(),
                subject: subject.trim(),
                gradeLevel: parsedGradeLevel,
            })

            setCode('');
            setDescription('');
            setSubject('');
            setGradeLevel('');
            setSuccessMessage('Standard added successfully.')
        } catch {
            setError('Unable to add standard. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Add Standard</h2>

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-slate-700">
                    <span>Code</span>
                    <input
                        placeholder="CCSS.MATH.3.NF.A.1"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                </label>

                <label className="space-y-1 text-sm text-slate-700">
                    <span>Subject</span>
                    <input
                        placeholder="Mathematics"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                </label>

                <label className="space-y-1 text-sm text-slate-700">
                    <span>Description</span>
                    <input
                        placeholder="Understand a fraction as a number on the number line."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                </label>

                <label className="space-y-1 text-sm text-slate-700">
                    <span>Grade Level</span>
                    <input
                        placeholder="3"
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                </label>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Standard'}
            </Button>
        </form>
    );
}