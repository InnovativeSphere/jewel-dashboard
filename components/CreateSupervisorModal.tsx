"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { createPerson } from "../redux/slices/peopleSlice";

interface CreateSupervisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSupervisorModal({
  isOpen,
  onClose,
}: CreateSupervisorModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      createPerson({
        first_name: firstName,
        last_name: lastName,
        bio,
        type: "supervisor",
      }),
    );
    setFirstName("");
    setLastName("");
    setBio("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-all duration-500">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md transition-all duration-500 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-base)]">
            Add Supervisor
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-lg transition-colors duration-300"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:border-[var(--color-base)] outline-none transition-all duration-300"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:border-[var(--color-base)] outline-none transition-all duration-300"
          />
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:border-[var(--color-base)] outline-none transition-all duration-300 resize-none h-24"
          />

          <button
            type="submit"
            className="w-full bg-[var(--color-accent)] text-white p-3 rounded-lg hover:bg-[var(--color-base)] transition-all duration-300 font-medium"
          >
            Add Supervisor
          </button>
        </form>
      </div>
    </div>
  );
}
