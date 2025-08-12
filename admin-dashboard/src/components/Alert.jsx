import React from 'react';

export default function Alert({ message, type = 'error' }) {
  const bgClass = type === 'error' ? 'bg-red-200' : 'bg-green-200';
  const textClass = type === 'error' ? 'text-red-700' : 'text-green-700';

  return (
    <div className={`${bgClass} ${textClass} p-3 rounded my-3`}>
      {message}
    </div>
  );
}
