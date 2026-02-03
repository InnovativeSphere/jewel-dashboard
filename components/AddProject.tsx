"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { createProject } from "../redux/slices/projectsSlice";
import { useRouter } from "next/router";

const CreateProjectForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      alert("Title is required");
      return;
    }

    setLoading(true);

    try {
      const resultAction = await dispatch(
        createProject({
          title: cleanTitle,
          description: description.trim() || undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        })
      );

      if (createProject.fulfilled.match(resultAction)) {
        alert("Project created successfully!");
        router.push("/projects");
      } else {
        alert(resultAction.payload || "Failed to create project");
      }
    } catch (err) {
      alert("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-base)] font-figtree">
        Create New Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-semibold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition"
            placeholder="Project Title"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition"
            placeholder="Project Description (optional)"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition"
            />
          </div>

          <div className="flex-1">
            <label className="block font-semibold mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-base)] text-white font-bold py-3 px-4 rounded-lg hover:brightness-110 hover:scale-[1.03] transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectForm;
