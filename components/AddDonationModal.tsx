"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchProjects } from "../redux/slices/projectsSlice";
import { addDonation, fetchDonations } from "../redux/slices/donationSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDonationModal({ isOpen, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);

  const [projectId, setProjectId] = useState<number | "">("");
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  useEffect(() => {
    if (isOpen) dispatch(fetchProjects());
  }, [isOpen, dispatch]);

  const handleSubmit = async () => {
    if (!projectId || amount === "" || isNaN(Number(amount))) return;

    await dispatch(
      addDonation({
        project_id: Number(projectId),
        donor_name: donorName || undefined,
        amount: Number(amount),
      })
    );

    await dispatch(fetchDonations());

    setProjectId("");
    setDonorName("");
    setAmount("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white w-full max-w-md sm:max-w-lg p-6 rounded-2xl shadow-xl relative animate-scaleIn transition-all duration-300">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black hover:rotate-90 transition-all"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 font-figtree">Add Donation</h2>

        {/* Project Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(Number(e.target.value))}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[var(--color-base)] transition"
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Donor Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Donor Name (optional)</label>
          <input
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="Anonymous"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] transition"
          />
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="0"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[var(--color-secondary)] transition"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[var(--color-base)] text-white py-2 rounded-lg hover:brightness-110 hover:scale-[1.02] transition-all duration-300 font-semibold"
        >
          Add Donation
        </button>
      </div>
    </div>
  );
}
