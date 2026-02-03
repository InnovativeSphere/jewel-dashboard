"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";
import EditProfileModal from "../components/EditProfileModal";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.currentUser);

  const [editOpen, setEditOpen] = useState(false);

  if (!user) return <p className="p-8 text-gray-500">Not logged in</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-8">

      <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-500 hover:shadow-xl">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--color-base)]">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-gray-500 mt-1">
              @{user.username || "no-username"}
            </p>
          </div>

          <button
            onClick={() => setEditOpen(true)}
            className="bg-[var(--color-accent)] text-white px-5 py-2 rounded-lg shadow hover:bg-[var(--color-accent-dark)] transition-all duration-500 font-medium"
          >
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-gray-700">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-400">Role</p>
            <p className="capitalize text-gray-700">{user.role}</p>
          </div>

          <div>
            <p className="text-gray-400">Status</p>
            <p
              className={`${
                user.is_active ? "text-green-600" : "text-red-600"
              } font-semibold`}
            >
              {user.is_active ? "Active" : "Inactive"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Member Since</p>
            <p className="text-gray-700">
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <button
          onClick={() => dispatch(logoutUser())}
          className="text-red-600 hover:text-red-700 hover:underline transition-all duration-300 font-medium"
        >
          Log Out
        </button>
      </div>

      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
      />
    </div>
  );
}
