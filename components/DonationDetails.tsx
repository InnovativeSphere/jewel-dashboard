"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDonations,
  updateDonation,
  removeDonation,
} from "../redux/slices/donationSlice";
import { RootState, AppDispatch } from "../redux/store";
import { FaTimes, FaEdit, FaSave, FaTrash } from "react-icons/fa";
import type { Donation } from "../redux/slices/donationSlice";

interface DonationDetailsProps {
  donationId: number;
  onClose: () => void;
}

export default function DonationDetails({ donationId, onClose }: DonationDetailsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { donations, status } = useSelector((state: RootState) => state.donations);
  const donation = donations.find((d: Donation) => d.id === donationId);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ donor_name: "", amount: "" });

  useEffect(() => {
    if (status === "idle") dispatch(fetchDonations(undefined));
  }, [dispatch, status]);

  useEffect(() => {
    if (donation) {
      setForm({
        donor_name: donation.donor_name || "",
        amount: String(donation.amount),
      });
    }
  }, [donation]);

  if (!donation) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-black/40">
        <div className="bg-white p-6 rounded-xl shadow text-center font-medium">
          Donation not found
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    await dispatch(
      updateDonation({
        id: donation.id,
        donor_name: form.donor_name,
        amount: Number(form.amount),
      })
    );
    dispatch(fetchDonations(undefined));
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this donation?")) return;
    await dispatch(removeDonation(donation.id));
    dispatch(fetchDonations(undefined));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 animate-scaleIn sm:p-4">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-lg font-bold text-[var(--color-base)]">
            Donation Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--color-gray)] transition-transform duration-300 hover:scale-110"
          >
            <FaTimes className="text-[var(--color-base)] w-5 h-5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Meta Info */}
        <div className="text-sm text-[var(--color-gray)] space-y-1 sm:text-xs">
          <p>Project: {donation.project_title || donation.project_id}</p>
          <p>Date: {new Date(donation.donation_date).toLocaleDateString()}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {/* Edit */}
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 hover:ring-2 hover:ring-blue-400"
          >
            <FaEdit /> Edit
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition transform hover:scale-105 hover:ring-2 hover:ring-green-400"
          >
            <FaSave /> Save
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition transform hover:scale-105 hover:ring-2 hover:ring-red-400"
          >
            <FaTrash /> Delete
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Donor Name</label>
            {isEditing ? (
              <input
                value={form.donor_name}
                onChange={(e) => setForm({ ...form, donor_name: e.target.value })}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
              />
            ) : (
              <p className="mt-1 text-[var(--color-base)]">{donation.donor_name || "Anonymous"}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Amount</label>
            {isEditing ? (
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
              />
            ) : (
              <p className="mt-1 font-semibold text-[var(--color-accent)]">
                ₦{Number(donation.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
