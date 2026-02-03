"use client";

interface BadgeProps {
  text: string;
  color?: string; // optional, defaults to primary
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const Badge: React.FC<BadgeProps> = ({
  text,
  color = "#d91a5d",
  position = "top-right",
}) => {
  const positions: Record<string, string> = {
    "top-left": "top-2 left-2",
    "top-right": "top-2 right-2",
    "bottom-left": "bottom-2 left-2",
    "bottom-right": "bottom-2 right-2",
  };

  return (
    <span
      className={`absolute px-3 py-1 text-sm font-semibold rounded-full text-white ${positions[position]}`}
      style={{
        backgroundColor: color,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
      // position
    >
      {text}
    </span>
  );
};

export default Badge;
