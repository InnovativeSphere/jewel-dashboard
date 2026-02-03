"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <Topbar sidebarCollapsed={sidebarCollapsed} />

      <main
        className={`
          pt-16 transition-all duration-500
          ${sidebarCollapsed ? "ml-20 mr-5" : "ml-70 mr-5"}
        `}
      >
        {children}
        <Footer />
      </main>
    </div>
  );
}
