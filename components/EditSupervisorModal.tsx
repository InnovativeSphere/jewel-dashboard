"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  updatePerson,
  deletePerson,
  Person,
} from "../redux/slices/peopleSlice";

interface EditSupervisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  supervisor: Person | null;
}

export default function EditSupervisorModal({
  isOpen,
  onClose,
  supervisor,
}: EditSupervisorModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (supervisor) {
      setFirstName(supervisor.first_name);
      setLastName(supervisor.last_name);
      setBio(supervisor.bio || "");
    }
  }, [supervisor]);

  if (!isOpen || !supervisor) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      updatePerson({
        id: supervisor.id,
        updates: { first_name: firstName, last_name: lastName, bio },
      }),
    );
    onClose();
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this supervisor?")) {
      await dispatch(deletePerson(supervisor.id));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-all duration-500">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md transition-all duration-500 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-base)]">
            Edit Supervisor
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-lg transition-colors duration-300"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
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

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-all duration-300 font-medium"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-all duration-300 font-medium"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
