"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import { fetchProjects, Project } from "../redux/slices/projectsSlice";

import CreateProjectModal from "../components/CreateProjectModal";
import EditProjectModal from "../components/EditProjectModal";

import { PencilIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import StatsCard from "@/components/StatusCard";

export default function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading } = useSelector(
    (state: RootState) => state.projects,
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const openEdit = (project: Project) => {
    setSelectedProject(project);
    setEditOpen(true);
    setActiveMenu(null);
  };

  const openDetails = (project: Project) => {
    setSelectedProject(project);
    setDetailsOpen(true);
    setActiveMenu(null);
  };

  const ringColors = [
    "bg-[var(--color-base)]",
    "bg-[var(--color-accent)]",
    "bg-[var(--color-secondary)]",
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-figtree">
          Projects
        </h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="bg-[var(--color-base)] text-white px-5 py-2 rounded-lg hover:brightness-110 hover:scale-[1.02] transition-all duration-300 font-semibold"
        >
          + Create Project
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {projects.map((project, index) => {
          const cardColor = ringColors[index % ringColors.length];

          return (
            <div
              key={project.id}
              className={`relative transition-all duration-300  hover:-translate-y-1`}
            >
              {/* StatsCard */}
              <StatsCard
                title={project.title}
                value={project.description || "No description"}
                className={`${cardColor} text-white`}
              />

              {/* 3-dot menu */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() =>
                    setActiveMenu(activeMenu === project.id ? null : project.id)
                  }
                  className="w-8 h-8 text-white rounded-full flex items-center justify-center hover:bg-gray-500 transition"
                >
                  ⋮
                </button>

                {activeMenu === project.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border overflow-hidden animate-scaleIn">
                    <button
                      onClick={() => openEdit(project)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => openDetails(project)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 transition-colors"
                    >
                      <InformationCircleIcon className="w-4 h-4" /> Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- MODALS ---------------- */}
      <CreateProjectModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <EditProjectModal
        isOpen={editOpen}
        project={selectedProject}
        onClose={() => setEditOpen(false)}
      />
      {detailsOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-fadeIn">
            <h2 className="text-xl font-bold mb-2">{selectedProject.title}</h2>
            <p className="text-gray-600 mb-4">
              {selectedProject.description || "No description"}
            </p>
            <div className="text-sm text-gray-400">
              {selectedProject.start_date && (
                <p>Start: {selectedProject.start_date}</p>
              )}
              {selectedProject.end_date && (
                <p>End: {selectedProject.end_date}</p>
              )}
            </div>
            <button
              onClick={() => setDetailsOpen(false)}
              className="mt-4 bg-[var(--color-base)] text-white px-4 py-2 rounded hover:brightness-110 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
