"use client";

import { ReactNode, MouseEventHandler } from "react";
import Badge from "./Badge"; // the badge we just made

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  image?: string; // optional image at the top
  badgeText?: string; // optional badge
  badgeColor?: string;
  badgePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export const Card = ({
  children,
  className = "",
  onClick,
  image,
  badgeText,
  badgeColor,
  badgePosition = "top-right",
}: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform hover:scale-[1.02] hover:shadow-xl cursor-pointer ${className} animate-fadeIn`}
    >
      {/* Image section */}
      {image && (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={image}
            alt="Card image"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          {badgeText && (
            <Badge
              text={badgeText}
              color={badgeColor}
              position={badgePosition}
            />
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">{children}</div>
    </div>
  );
};
