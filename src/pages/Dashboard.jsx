import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';

const Dashboard = () => {
  const { t, isRTL, invoices, clients, settings } = useApp();

  const totalInvoices = invoices.length;
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
  const totalClients = clients.length;

  const recentInvoices = [...invoices].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className={`p-6 max-w-7xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{t('مرحباً بك في فاتورتي', 'Welcome to Fatourtii')}</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">📄</div>
          <div className="text-lg opacity-80">{t('إجمالي الفواتير', 'Total Invoices')}</div>
          <div className="text-3xl font-bold">{totalInvoices}</div>
        </div>
        <div className="bg-green-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">💰</div>
          <div className="text-lg opacity-80">{t('إجمالي الإيرادات', 'Total Revenue')}</div>
          <div className="text-3xl font-bold">{formatCurrency(totalRevenue, settings?.currency, isRTL ? 'ar' : 'en')}</div>
        </div>
        <div className="bg-yellow-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">⏳</div>
          <div className="text-lg opacity-80">{t('فواتير قيد الانتظار', 'Pending')}</div>
          <div className="text-3xl font-bold">{pendingInvoices}</div>
        </div>
        <div className="bg-purple-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-lg opacity-80">{t('العملاء', 'Clients')}</div>
          <div className="text-3xl font-bold">{totalClients}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{t('أحدث الفواتير', 'Recent Invoices')}</h2>
        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">{t('رقم الفاتورة', 'Invoice #')}</th>
                  <th className="px-6 py-3">{t('العميل', 'Client')}</th>
                  <th className="px-6 py-3">{t('التاريخ', 'Date')}</th>
                  <th className="px-6 py-3">{t('المبلغ', 'Amount')}</th>
                  <th className="px-6 py-3">{t('الحالة', 'Status')}</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4">{inv.clientName}</td>
                    <td className="px-6 py-4">{formatDate(inv.date, settings?.calendar, isRTL ? 'ar' : 'en')}</td>
                    <td className="px-6 py-4">{formatCurrency(inv.total, settings?.currency, isRTL ? 'ar' : 'en')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        inv.status === 'paid' ? 'bg-green-100 text-green-800' :
                        inv.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {inv.status === 'paid' ? t('مدفوعة', 'Paid') :
                         inv.status === 'pending' ? t('قيد الانتظار', 'Pending') :
                         t('متأخرة', 'Overdue')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">{t('لا توجد فواتير بعد', 'No invoices yet')}</p>
            <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              {t('إنشاء فاتورة جديدة', 'Create New Invoice')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
