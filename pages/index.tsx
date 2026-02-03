"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { loginUser } from "@/redux/slices/authSlice";
import {
  selectAuthLoading,
  selectAuthError,
  selectAuthToken,
} from "@/redux/slices/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const token = useAppSelector(selectAuthToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-black)]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-[var(--color-base)] text-center">
          Admin Login
        </h1>

        <p className="text-gray-500 text-sm text-center mt-1">
          Enter your credentials to continue
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-base)] transition-all duration-300"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-base)] transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] transition-all duration-500 text-white font-medium disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
