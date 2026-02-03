"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { createUser } from "../redux/slices/authSlice";

export default function SignupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    role: "admin" as "admin" | "super_admin",
    password: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        createUser({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          username: form.username,
          role: form.role,
          password: form.password,
        }),
      ).unwrap();

      setSuccess("User created successfully!");
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        role: "admin",
        password: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 bg-[var(--color-light)]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-[var(--color-base)] mb-6 text-center">
          Register New Admin
        </h1>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        {success && (
          <p className="text-green-600 mb-3 text-center">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "First Name", name: "first_name", type: "text" },
            { label: "Last Name", name: "last_name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Username", name: "username", type: "text" },
            { label: "Password", name: "password", type: "password" },
            {
              label: "Confirm Password",
              name: "confirmPassword",
              type: "password",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block mb-1 font-medium text-gray-600">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                required={field.type !== "text" || field.name !== "username"}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-base)] transition-all duration-300"
              />
            </div>
          ))}

          <div>
            <label className="block mb-1 font-medium text-gray-600">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-base)] transition-all duration-300"
            >
              <option value="admin">Admin</option>
              {/* <option value="super_admin">Super Admin</option> */}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--color-accent)] hover:bg-[var(--color-secondary)] text-white font-medium rounded-lg transition-all duration-500"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
