interface StatsCardProps {
  title: string;
  value: string | number;
  className?: string;
  icon?: React.ReactNode;
}

export default function StatsCard({
  title,
  value,
  className = "",
  icon,
}: StatsCardProps) {
  return (
    <div
      className={`p-6 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-transform transition-shadow duration-500 flex items-center justify-between ${className}`}
    >
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
      </div>

      {icon && (
        <div className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-500 hover:scale-110">
          {icon}
        </div>
      )}
    </div>
  );
}
