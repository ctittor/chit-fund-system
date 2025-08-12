import React from 'react';

export default function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block font-semibold mb-1 text-gray-700">{label}</label>}
      <input
        {...props}
        className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
