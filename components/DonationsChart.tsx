"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export interface DonationsChartProps {
  data: {
    month: string;
    total: number;
  }[];
  onClose: () => void;
}

export default function DonationsChart({ data, onClose }: DonationsChartProps) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Donations",
        data: data.map((d) => d.total),
        backgroundColor: "var(--color-accent)",   // from global CSS
        borderRadius: 8,
        hoverBackgroundColor: "var(--color-base)", // hover color from CSS
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return `₦${value.toLocaleString()}`;
          },
          color: "var(--color-base)",  
        },
        grid: {
          color: "var(--color-gray)/30",
        },
      },
      x: {
        ticks: {
          color: "var(--color-base)",
          autoSkip: false,
        },
        grid: {
          color: "transparent",
        },
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn p-4">
      <div
        className="
          bg-[var(--color-white)] w-full max-w-3xl
          p-6 rounded-2xl shadow-2xl
          animate-scaleIn
          sm:p-4
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-lg font-semibold text-[var(--color-base)]">
            Donation Analytics
          </h2>

          <button
            onClick={onClose}
            className="text-[var(--color-gray)] hover:text-[var(--color-base)] transition-transform duration-300 hover:scale-110"
          >
            ✕
          </button>
        </div>

        {/* Chart */}
        {data.length === 0 ? (
          <p className="text-[var(--color-secondary)] text-center py-10">
            No donation data available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Bar data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
}
