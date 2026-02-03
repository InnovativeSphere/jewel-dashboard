"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { createDonation } from "../redux/slices/donationSlice";
import { AppDispatch } from "@/redux/store";
import { FaTimes, FaDonate } from "react-icons/fa";

interface CreateDonationProps {
  onClose: () => void;
}

export default function CreateDonation({ onClose }: CreateDonationProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    title: "",
    target_amount: "",
    current_amount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!form.target_amount || Number(form.target_amount) <= 0) {
      setError("Target amount must be greater than zero");
      return;
    }

    setLoading(true);

    await dispatch(
      createDonation({
        title: form.title,
        target_amount: Number(form.target_amount),
        current_amount: Number(form.current_amount) || 0,
      })
    );

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaDonate className="text-green-600" />
            Create Donation
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">

          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Clean Water Fund"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Target Amount</label>
            <input
              type="number"
              value={form.target_amount}
              onChange={(e) =>
                setForm({ ...form, target_amount: e.target.value })
              }
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="500000"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Starting Amount (optional)
            </label>
            <input
              type="number"
              value={form.current_amount}
              onChange={(e) =>
                setForm({ ...form, current_amount: e.target.value })
              }
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="0"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>

        </div>
      </div>
    </div>
  );
}
