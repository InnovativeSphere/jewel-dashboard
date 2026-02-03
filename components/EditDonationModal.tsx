"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updateDonation, fetchDonations } from "../redux/slices/donationSlice";
import { Donation } from "../redux/slices/donationSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  donation: Donation | null;
}

export default function EditDonationModal({
  isOpen,
  onClose,
  donation,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  useEffect(() => {
    if (donation) {
      setDonorName(donation.donor_name || "");
      setAmount(donation.amount);
    }
  }, [donation]);

  if (!isOpen || !donation) return null;

  const handleEdit = async () => {
    if (amount === "" || isNaN(Number(amount))) return;

    // Dispatch the update
    await dispatch(
      updateDonation({
        id: donation.id,
        donor_name: donorName || undefined,
        amount: Number(amount),
      })
    );

    // Refresh donations list to reflect changes
    await dispatch(fetchDonations());

    // Close modal
    onClose();

    // Optional: reset local state
    setDonorName("");
    setAmount("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Donation</h2>

        <label className="block mb-2 font-medium">Donor Name</label>
        <input
          type="text"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          placeholder="Anonymous"
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="0"
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={handleEdit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}
