"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchDonations, Donation } from "../redux/slices/donationSlice";

import AddDonationModal from "../components/AddDonationModal";
import DonationsChart from "@/components/DonationsChart";
import DonationDetails from "@/components/DonationDetails";

import StatusCard from "@/components/StatusCard";
import {
  DocumentTextIcon,
  EyeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import ViewDonationHistoryModal from "@/components/ViewDonationHistoryModal";

export default function DonationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { donations, status } = useSelector(
    (state: RootState) => state.donations,
  );

  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null,
  );
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  const grouped: Record<number, Donation[]> = {};
  donations.forEach((d) => {
    if (!grouped[d.project_id]) grouped[d.project_id] = [];
    grouped[d.project_id].push(d);
  });

  const chartData = useMemo(() => {
    if (!selectedDonation) return [];
    const projectDonations = donations.filter(
      (d) => d.project_id === selectedDonation.project_id,
    );

    const map: Record<string, number> = {};
    projectDonations.forEach((d) => {
      const date = new Date(d.created_at);
      const key = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      map[key] = (map[key] || 0) + Number(d.amount || 0);
    });

    return Object.entries(map).map(([month, total]) => ({ month, total }));
  }, [selectedDonation, donations]);

  const openView = (d: Donation) => {
    setSelectedDonation(d);
    setViewOpen(true);
    setActiveMenu(null);
  };
  const openChart = (d: Donation) => {
    setSelectedDonation(d);
    setChartOpen(true);
    setActiveMenu(null);
  };
  const openDetails = (d: Donation) => {
    setSelectedDonation(d);
    setDetailsOpen(true);
    setActiveMenu(null);
  };

  const ringColors = [
    "ring-[var(--color-base)]",
    "ring-[var(--color-accent)]",
    "ring-[var(--color-secondary)]",
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-figtree">
          Donations
        </h1>
        <button
          onClick={() => setAddOpen(true)}
          className="mt-3 sm:mt-0 bg-[var(--color-base)] text-white px-5 py-2 rounded-lg hover:brightness-110 hover:scale-[1.04] transition-all duration-300"
        >
          + Add Donation
        </button>
      </div>

      {status === "loading" && (
        <p className="text-[var(--color-gray)]">Loading donations...</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(grouped).map(([projectId, items], index) => {
          const total = items.reduce(
            (sum, d) => sum + Number(d.amount || 0),
            0,
          );
          const projectTitle =
            items[0]?.project_title || `Project ${projectId}`;
          const randomRing = ringColors[index % ringColors.length];

          return (
            <div
              key={projectId}
              className={`relative transition-all duration-300 bg-white hover:shadow-2xl hover:-translate-y-1 hover:${randomRing}`}
            >
              {/* StatusCard */}
              <StatusCard
                title={projectTitle}
                value={`₦${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                icon={
                  <DocumentTextIcon className="w-6 h-6 text-[var(--color-base)]" />
                }
                className="cursor-pointer"
              />

              {/* Menu Button */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() =>
                    setActiveMenu(
                      activeMenu === Number(projectId)
                        ? null
                        : Number(projectId),
                    )
                  }
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  ⋮
                </button>

                {/* Dropdown */}
                {activeMenu === Number(projectId) && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border overflow-hidden scale-100 origin-top-right animate-fadeIn">
                    <MenuItem
                      icon={<DocumentTextIcon className="w-4 h-4 mr-2" />}
                      onClick={() => openView(items[0])}
                    >
                      View History
                    </MenuItem>
                    <MenuItem
                      icon={<EyeIcon className="w-4 h-4 mr-2" />}
                      onClick={() => openDetails(items[0])}
                    >
                      Details
                    </MenuItem>
                    <MenuItem
                      icon={<ChartBarIcon className="w-4 h-4 mr-2" />}
                      onClick={() => openChart(items[0])}
                    >
                      Analytics
                    </MenuItem>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <AddDonationModal
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          dispatch(fetchDonations());
        }}
      />
      <ViewDonationHistoryModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        projectId={selectedDonation?.project_id || null}
        projectTitle={selectedDonation?.project_title}
      />
      {chartOpen && selectedDonation && (
        <DonationsChart data={chartData} onClose={() => setChartOpen(false)} />
      )}
      {detailsOpen && selectedDonation && (
        <DonationDetails
          donationId={selectedDonation.id}
          onClose={() => setDetailsOpen(false)}
        />
      )}
    </div>
  );
}

/* Menu Item Component */
function MenuItem({
  icon,
  children,
  onClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center transition-colors"
    >
      {icon} {children}
    </button>
  );
}
