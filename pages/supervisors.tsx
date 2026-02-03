"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchPeople, Person } from "../redux/slices/peopleSlice";
import CreateSupervisorModal from "../components/CreateSupervisorModal";
import EditSupervisorModal from "../components/EditSupervisorModal";
import StatsCard from "../components/StatusCard";
import { Users } from "lucide-react";
import '../app/globals.css'
export default function SupervisorsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { people, loading, error } = useSelector(
    (state: RootState) => state.people
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Person | null>(null);

  const supervisors = people.filter((p) => p.type === "supervisor");

  useEffect(() => {
    dispatch(fetchPeople());
  }, [dispatch]);

  const openEditModal = (supervisor: Person) => {
    setSelectedSupervisor(supervisor);
    setEditModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-base)]">
          Supervisors
        </h1>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[var(--color-accent)] text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          + Add Supervisor
        </button>
      </div>

      {/* Top-level Status Cards */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <StatsCard
          title="Total Supervisors"
          value={supervisors.length}
          className="bg-[var(--color-accent)] text-white"
          icon={<Users className="w-5 h-5 text-white" />}
        />
        <StatsCard
          title="Active"
          value={supervisors.filter(s => s.is_active).length}
          className="bg-[var(--color-black)] text-white"
          icon={<Users className="w-5 h-5 text-white" />}
        />
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-gray-500">Loading supervisors...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && supervisors.length === 0 && (
        <p className="text-gray-500">No supervisors found.</p>
      )}

      {/* Supervisor Cards */}
      <div className="flex flex-col space-y-6">
        {supervisors.map((sup) => (
          <div
            key={sup.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col md:flex-row md:justify-between gap-4"
          >
            <div className="flex flex-col space-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {sup.first_name} {sup.last_name}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base line-clamp-3">
                {sup.bio || "No bio provided."}
              </p>
              {sup.is_active !== undefined && (
                <span
                  className={`text-xs font-medium mt-1 ${
                    sup.is_active ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {sup.is_active ? "Active" : "Inactive"}
                </span>
              )}
            </div>

            <div className="flex justify-end mt-4 md:mt-0">
              <button
                onClick={() => openEditModal(sup)}
                className="bg-[var(--color-base)] text-white px-4 py-2 rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <CreateSupervisorModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <EditSupervisorModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        supervisor={selectedSupervisor}
      />
    </div>
  );
}
