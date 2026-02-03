"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  HomeIcon,
  UserGroupIcon,
  PhotoIcon,
  ClipboardIcon,
  GiftIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { logoutUser } from "../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { FaAmericanSignLanguageInterpreting } from "react-icons/fa";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Donations", href: "/donations", icon: GiftIcon },
  { name: "Projects", href: "/projects", icon: ClipboardIcon },
  { name: "Photos", href: "/photos", icon: PhotoIcon },
  { name: "Supervisors", href: "/supervisors", icon: UserGroupIcon },
  { name: "Volunteers", href: "/volunteers", icon: UserGroupIcon },
  { name: "Profile", href: "/profile", icon: UserIcon },
  { name: "Register", href: "/signup", icon: FaAmericanSignLanguageInterpreting },
];

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-[var(--color-black)] text-[var(--color-white)]
        flex flex-col transition-all duration-500 z-50
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-gray)]">
        {!collapsed && (
          <span className="font-bold text-[var(--color-base)] text-lg">
            Dashboard
          </span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-[var(--color-gray)] rounded transition-all duration-300"
        >
          {collapsed ? <Bars3Icon className="w-6 h-6" /> : <XMarkIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              flex items-center gap-3 p-2 rounded-lg text-sm font-medium
              transition-all duration-300
              ${pathname === item.href
                ? "bg-[var(--color-accent)] text-white"
                : "hover:bg-[var(--color-gray)] hover:text-white"}
            `}
          >
            <item.icon
              className={`w-5 h-5 transition-colors duration-300 ${
                pathname === item.href ? "text-white" : "text-[var(--color-base)]"
              }`}
            />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[var(--color-gray)]">
        <button
          onClick={async () => {
            await dispatch(logoutUser());
            router.push("/");
          }}
          className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-base)] p-2 rounded-lg transition-all duration-300 text-sm font-medium"
        >
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
