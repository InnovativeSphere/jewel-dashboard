"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchProjects } from "../redux/slices/projectsSlice";
import { addProjectImages } from "../redux/slices/ProjectImagesSlice";

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPhotoModal({ isOpen, onClose }: AddPhotoModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );
  const [beforeUrl, setBeforeUrl] = useState("");
  const [afterUrl, setAfterUrl] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleSubmit = () => {
    if (!selectedProjectId) return alert("Select a project");
    const imagesToAdd: {
      image_url: string;
      description: "before" | "after";
    }[] = [];
    if (beforeUrl.trim())
      imagesToAdd.push({ image_url: beforeUrl.trim(), description: "before" });
    if (afterUrl.trim())
      imagesToAdd.push({ image_url: afterUrl.trim(), description: "after" });

    dispatch(
      addProjectImages({ project_id: selectedProjectId!, images: imagesToAdd }),
    );

    // Reset
    setBeforeUrl("");
    setAfterUrl("");
    setSelectedProjectId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md animate-fadeIn relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-6 text-black">
          Add Project Images
        </h2>

        {/* Project select */}
        <label className="block mb-2 font-medium text-gray-700">Project</label>
        <select
          value={selectedProjectId || ""}
          onChange={(e) => setSelectedProjectId(Number(e.target.value))}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:border-var(--color-base) transition-all"
        >
          <option value="">Select project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>

        {/* Before URL */}
        <label className="block mb-2 font-medium text-gray-700">
          Before Image URL
        </label>
        <input
          type="text"
          value={beforeUrl}
          onChange={(e) => setBeforeUrl(e.target.value)}
          placeholder="https://example.com/before.jpg"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:border-var(--color-base) transition-all"
        />

        {/* After URL */}
        <label className="block mb-2 font-medium text-gray-700">
          After Image URL
        </label>
        <input
          type="text"
          value={afterUrl}
          onChange={(e) => setAfterUrl(e.target.value)}
          placeholder="https://example.com/after.jpg"
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:border-var(--color-base) transition-all"
        />

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-white)",
          }}
          className="w-full py-3 rounded-lg hover:opacity-90 transition-all duration-300"
        >
          Add Images
        </button>
      </div>
    </div>
  );
}
