"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { createPerson } from "../redux/slices/peopleSlice";

interface CreateVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateVolunteerModal({
  isOpen,
  onClose,
}: CreateVolunteerModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      createPerson({ first_name: firstName, last_name: lastName, bio, type: "volunteer" })
    );
    setFirstName("");
    setLastName("");
    setBio("");
    onClose();
  };

  if (!isOpen) return null;

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
            Add Volunteer
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-all duration-500 font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            className="w-full bg-[var(--color-base)] text-[var(--color-white)] p-2 rounded-[var(--radius-lg)] hover:bg-[var(--color-accent)] transition-all duration-500"
          >
            Create Volunteer
          </button>
        </form>
      </div>
    </div>
  );
}
