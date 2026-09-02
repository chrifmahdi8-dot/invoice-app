import React, { useEffect } from 'react';

/**
 * نافذة منبثقة (Modal) مع خلفية ضبابية ودعم إغلاق عند النقر على الخلفية أو زر الإغلاق
 * Modal component with backdrop blur, keyboard accessibility, and overlay click-to-close
 */
export default function Modal({ isOpen, onClose, title, children }) {
  // إغلاق النافذة المنبثقة عند الضغط على مفتاح Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
          {title ? (
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
