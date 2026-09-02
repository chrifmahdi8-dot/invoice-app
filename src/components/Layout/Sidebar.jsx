import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/**
 * الشريط الجانبي الثابت للتنقل بين صفحات التطبيق
 * Fixed Sidebar Component for application navigation
 */
export default function Sidebar({ isOpen, closeSidebar }) {
  const { t } = useApp();

  const navItems = [
    { to: '/', icon: '📊', label: t('لوحة التحكم', 'Dashboard') },
    { to: '/create', icon: '➕', label: t('فاتورة جديدة', 'New Invoice') },
    { to: '/invoices', icon: '📋', label: t('الفواتير', 'Invoices') },
    { to: '/clients', icon: '👥', label: t('العملاء', 'Clients') },
    { to: '/settings', icon: '⚙️', label: t('الإعدادات', 'Settings') },
  ];

  return (
    <aside 
      className={`fixed top-16 start-0 w-64 h-[calc(100vh-4rem)] bg-white border-e border-gray-200 z-50 pt-4 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full max-lg:hidden'
      }`}
    >
      <nav className="flex flex-col">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              }`
            }
          >
            <span className="text-xl" role="img" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
