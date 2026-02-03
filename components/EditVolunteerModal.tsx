"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updatePerson, deletePerson, Person } from "../redux/slices/peopleSlice";

interface EditVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: Person | null;
}

export default function EditVolunteerModal({
  isOpen,
  onClose,
  volunteer,
}: EditVolunteerModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (volunteer) {
      setFirstName(volunteer.first_name);
      setLastName(volunteer.last_name);
      setBio(volunteer.bio || "");
    }
  }, [volunteer]);

  if (!isOpen || !volunteer) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      updatePerson({
        id: volunteer.id,
        updates: { first_name: firstName, last_name: lastName, bio },
      })
    );
    onClose();
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this volunteer?")) {
      await dispatch(deletePerson(volunteer.id));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative bg-[var(--color-white)] rounded-[var(--radius-lg)] shadow-xl w-full max-w-md p-6 animate-fadeIn z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[var(--color-base)]">
            Edit Volunteer
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-all duration-500 font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-[var(--radius-lg)] p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-base)] transition-all duration-500"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-[var(--radius-lg)] p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-base)] transition-all duration-500"
          />
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-gray-300 rounded-[var(--radius-lg)] p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-base)] transition-all duration-500"
          />

          <div className="flex justify-between gap-3">
            <button
              type="submit"
              className="flex-1 bg-[var(--color-base)] text-[var(--color-white)] p-2 rounded-[var(--radius-lg)] hover:bg-[var(--color-accent)] transition-all duration-500"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white p-2 rounded-[var(--radius-lg)] hover:bg-red-700 transition-all duration-500"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
