import { FaHandHoldingHeart } from "react-icons/fa";
import StatsCard from "./StatusCard";

interface Donation {
  id: number;
  donor_name: string;
  amount: number;
  donation_date: string;
}

interface RecentDonationsTableProps {
  donations: Donation[];
}

export default function RecentDonationsTable({
  donations,
}: RecentDonationsTableProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Recent Donations</h2>
        <span className="text-xs text-gray-400">Last {donations.length}</span>
      </div>

      {/* CARDS */}
      <div className="flex flex-col gap-3">
        {donations.map((d, index) => (
          <StatsCard
            key={d.id}
            title={d.donor_name}
            value={new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              maximumFractionDigits: 0,
            }).format(d.amount)}
            icon={<FaHandHoldingHeart />}
            className="cursor-pointer animate-fadeIn"
          />
        ))}
      </div>

      {/* EMPTY STATE */}
      {donations.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">
          No donations yet
        </p>
      )}
    </div>
  );
}
