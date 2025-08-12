import React from 'react';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded shadow-lg w-5/6 md:w-1/3 p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

export default Modal;
