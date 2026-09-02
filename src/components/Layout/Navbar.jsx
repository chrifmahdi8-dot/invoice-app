import React from 'react';
import { useApp } from '../../context/AppContext';

/**
 * شريط التنقل العلوي الثابت للتطبيق
 * Fixed Top Navbar Component
 */
export default function Navbar() {
  const { language, toggleLanguage, settings, updateSettings } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-16 bg-white border-b border-gray-200 shadow-sm z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* الشعار - Logo */}
      <div className="flex items-center">
        <span className="text-xl font-bold text-blue-600">
          فاتورتي | Fatourtii
        </span>
      </div>

      {/* أزرار التحكم: العملة واللغة */}
      <div className="flex items-center gap-3">
        <select
          value={settings?.currency || 'SAR'}
          onChange={(e) => updateSettings({ currency: e.target.value })}
          className="text-sm font-semibold rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 px-3 py-1 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="SAR">SAR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="AED">AED</option>
          <option value="KWD">KWD</option>
          <option value="BHD">BHD</option>
          <option value="OMR">OMR</option>
          <option value="QAR">QAR</option>
          <option value="EGP">EGP</option>
          <option value="JOD">JOD</option>
        </select>
        
        <button
          type="button"
          onClick={toggleLanguage}
          className="px-3.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors shadow-sm cursor-pointer"
        >
          {language === 'ar' ? 'EN' : 'عربي'}
        </button>
      </div>
    </header>
  );
}
