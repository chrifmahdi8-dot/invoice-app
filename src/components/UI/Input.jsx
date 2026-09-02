import React from 'react';

/**
 * حقل إدخال مخصص مع دعم التسمية والاتجاه (RTL / LTR)
 * Custom Input component supporting label, validation, and text direction
 */
export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  className = '',
  dir,
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 select-none text-start"
        >
          {label}
          {required && <span className="text-red-500 mx-1">*</span>}
        </label>
      )}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        dir={dir}
        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${className}`.trim()}
        {...props}
      />
    </div>
  );
}
