"use client";

import { useState } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: FAQItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="border border-gray-200 rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
        >
          <button
            onClick={() => toggle(idx)}
            className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-[#f59320]/10 transition-colors duration-300"
          >
            <span className="text-lg font-semibold text-[#0e2c27]">
              {item.question}
            </span>
            <span
              className={`transform transition-transform duration-300 ${
                activeIndex === idx ? "rotate-45" : "rotate-0"
              } text-[#d91a5d] text-2xl font-bold`}
            >
              +
            </span>
          </button>
          <div
            className={`px-6 overflow-hidden text-gray-700 bg-[#f1f9fb] transition-all duration-500 ease-in-out ${
              activeIndex === idx ? "max-h-96 py-4" : "max-h-0"
            }`}
          >
            <p className="text-base leading-relaxed">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
