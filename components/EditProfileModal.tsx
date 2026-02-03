"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updateUser, User } from "../redux/slices/authSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function EditProfileModal({ isOpen, onClose, user }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username || "",
        email: user.email,
        password: "",
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    await dispatch(
      updateUser({
        id: user.id,
        updates: {
          first_name: form.first_name,
          last_name: form.last_name,
          username: form.username || undefined,
          email: form.email,
          ...(form.password && { password: form.password }),
        },
      }),
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl transition-all duration-500 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[var(--color-base)]">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {["first_name", "last_name", "username", "email"].map((field) => (
            <input
              key={field}
              placeholder={field.replace("_", " ")}
              value={(form as any)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-base)] transition-all duration-300"
            />
          ))}

          <input
            type="password"
            placeholder="New Password (optional)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-base)] transition-all duration-300"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[var(--color-accent)] text-white py-3 rounded-lg mt-4 hover:bg-[var(--color-accent-dark)] transition-all duration-500 font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
