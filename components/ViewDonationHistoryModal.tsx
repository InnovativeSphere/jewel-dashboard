"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchDonations, Donation } from "../redux/slices/donationSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: number | null;
  projectTitle?: string;
}

export default function ViewDonationHistoryModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { donations, status } = useSelector((state: RootState) => state.donations);

  // Fetch donations for this project when modal opens
  useEffect(() => {
    if (isOpen && projectId !== null) {
      dispatch(fetchDonations(projectId));
    }
  }, [isOpen, projectId, dispatch]);

  if (!isOpen || !projectId) return null;

  // Filter donations to only this project
  const projectDonations = donations.filter(d => d.project_id === projectId);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div
        className="
          bg-white w-100 max-w-3xl p-6 rounded-xl shadow-xl relative
          animate-scaleIn
          sm:p-4 sm:rounded-lg
        "
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-[var(--color-base)] hover:rotate-90 transition-all duration-300"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl sm:text-xl font-bold mb-1">Donation History</h2>
        {projectTitle && (
          <p className="text-gray-500 mb-4 text-sm sm:text-xs">{projectTitle}</p>
        )}

        {/* Loading */}
        {status === "loading" && (
          <p className="text-gray-500 animate-pulse text-sm">Loading donations...</p>
        )}

        {/* No donations */}
        {projectDonations.length === 0 && status !== "loading" && (
          <p className="text-gray-500 italic text-sm">No donations recorded.</p>
        )}

        {/* Donations Table */}
        {projectDonations.length > 0 && (
          <div className="max-h-[420px] sm:max-h-[300px] overflow-y-auto border rounded-lg shadow-inner">
            <table className="w-full border-collapse text-sm sm:text-xs">
              <thead className="bg-[var(--color-light)] sticky top-0 z-10">
                <tr>
                  <th className="p-3 border font-medium text-[var(--color-black)]">Donor</th>
                  <th className="p-3 border font-medium text-[var(--color-black)]">Amount</th>
                  <th className="p-3 border font-medium text-[var(--color-black)]">Date</th>
                </tr>
              </thead>

              <tbody>
                {projectDonations.map((d: Donation) => (
                  <tr
                    key={d.id}
                    className="transition-all duration-200 hover:bg-[var(--color-light)] hover:shadow-sm"
                  >
                    <td className="p-3 border">{d.donor_name || "Anonymous"}</td>
                    <td className="p-3 border font-semibold text-[var(--color-accent)]">
                      ₦{Number(d.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 border text-[var(--color-gray)]">
                      {new Date(d.donation_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
