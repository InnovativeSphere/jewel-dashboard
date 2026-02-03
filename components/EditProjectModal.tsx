"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  updateProject,
  deleteProject,
  Project,
} from "../redux/slices/projectsSlice";

interface Props {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
}

export default function EditProjectModal({ isOpen, project, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setStartDate(project.start_date || "");
      setEndDate(project.end_date || "");
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleUpdate = async () => {
    await dispatch(
      updateProject({
        id: project.id,
        updates: {
          title,
          description,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        },
      })
    );

    onClose();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project?")) return;

    await dispatch(deleteProject(project.id));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl space-y-5 animate-fadeIn">
        <h2 className="text-2xl font-bold text-[var(--color-base)] font-figtree">
          Edit Project
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition"
          placeholder="Project Title"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition"
          placeholder="Description"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:brightness-110 transition-all duration-300"
          >
            Delete
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="px-4 py-2 rounded-lg bg-[var(--color-base)] text-white font-semibold hover:brightness-110 hover:scale-[1.03] transition-all duration-300"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
