"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchPeople, Person } from "../redux/slices/peopleSlice";
import CreateVolunteerModal from "../components/CreateVolunteerModal";
import EditVolunteerModal from "../components/EditVolunteerModal";
import { Users, Activity } from "lucide-react";
import StatsCard from "@/components/StatusCard";

export default function VolunteersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { people, loading, error } = useSelector(
    (state: RootState) => state.people
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Person | null>(
    null
  );

  const volunteers = people.filter((p) => p.type === "volunteer");

  useEffect(() => {
    dispatch(fetchPeople());
  }, [dispatch]);

  const openEditModal = (volunteer: Person) => {
    setSelectedVolunteer(volunteer);
    setEditModalOpen(true);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header + Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-[var(--color-base)]">
          Volunteers
        </h1>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[var(--color-accent)] text-white px-5 py-2 rounded-lg shadow hover:bg-[var(--color-accent-dark)] transition-all duration-500 font-medium"
        >
          + Add Volunteer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Volunteers"
          value={volunteers.length}
          className="bg-[var(--color-accent)] text-white"
          icon={<Users className="w-5 h-5" />}
        />
        <StatsCard
          title="Active"
          value={volunteers.length}
          className="bg-[var(--color-black)] text-white"
          icon={<Activity className="w-5 h-5" />}
        />
      </div>

      {/* Volunteers List */}
      <div className="flex flex-col gap-6">
        {volunteers.map((vol) => (
          <div
            key={vol.id}
            className="bg-white rounded-[var(--radius-lg)] shadow-md p-6 hover:shadow-xl transition-all duration-500 flex flex-col gap-3 cursor-pointer"
          >
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-base)]">
                {vol.first_name} {vol.last_name}
              </h2>
              <p className="text-gray-500 mt-1 line-clamp-3">
                {vol.bio || "No bio provided"}
              </p>
            </div>

            <button
              onClick={() => openEditModal(vol)}
              className="self-start bg-[var(--color-accent)] text-white px-4 py-2 rounded-[var(--radius-lg)] shadow hover:bg-[var(--color-secondary)] transition-all duration-500 font-medium"
            >
              Edit
            </button>
          </div>
        ))}

        {!loading && volunteers.length === 0 && (
          <p className="text-gray-500 text-center mt-6">
            No volunteers found.
          </p>
        )}
      </div>

      {/* Modals */}
      <CreateVolunteerModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <EditVolunteerModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        volunteer={selectedVolunteer}
      />
    </div>
  );
}
