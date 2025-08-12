import React from "react";
export default function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-semibold mb-1">{label}</label>
      <input
        {...props}
        className="border border-gray-300 rounded py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
