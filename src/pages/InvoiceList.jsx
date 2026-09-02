import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';

const InvoiceList = () => {
  const { t, isRTL, invoices, deleteInvoice, settings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm(t('هل أنت متأكد من حذف هذه الفاتورة؟', 'Are you sure you want to delete this invoice?'))) {
      deleteInvoice(id);
    }
  };

  return (
    <div className={`p-6 max-w-7xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">{t('الفواتير', 'Invoices')}</h1>
        <Link to="/create" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">
          + {t('إنشاء فاتورة', 'Create Invoice')}
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder={t('البحث باسم العميل أو رقم الفاتورة...', 'Search by client or invoice #...')}
            className="border rounded-lg px-4 py-2 w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['all', 'paid', 'pending', 'overdue'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  statusFilter === status 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? t('الكل', 'All') :
                 status === 'paid' ? t('مدفوعة', 'Paid') :
                 status === 'pending' ? t('قيد الانتظار', 'Pending') :
                 t('متأخرة', 'Overdue')}
              </button>
            ))}
          </div>
        </div>

        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">{t('رقم الفاتورة', 'Invoice #')}</th>
                  <th className="px-6 py-3">{t('العميل', 'Client')}</th>
                  <th className="px-6 py-3">{t('التاريخ', 'Date')}</th>
                  <th className="px-6 py-3">{t('المبلغ', 'Amount')}</th>
                  <th className="px-6 py-3">{t('الحالة', 'Status')}</th>
                  <th className="px-6 py-3 text-center">{t('إجراءات', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4">{inv.clientName}</td>
                    <td className="px-6 py-4">{formatDate(inv.date, settings?.calendar, isRTL ? 'ar' : 'en')}</td>
                    <td className="px-6 py-4 font-semibold">{formatCurrency(inv.total, settings?.currency, isRTL ? 'ar' : 'en')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        inv.status === 'paid' ? 'bg-green-100 text-green-800' :
                        inv.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {inv.status === 'paid' ? t('مدفوعة', 'Paid') :
                         inv.status === 'pending' ? t('قيد الانتظار', 'Pending') :
                         t('متأخرة', 'Overdue')}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button className="text-blue-600 hover:text-blue-800" title={t('عرض', 'View')}>👁️</button>
                      <button onClick={() => handleDelete(inv.id)} className="text-red-600 hover:text-red-800" title={t('حذف', 'Delete')}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {t('لا توجد فواتير مطابقة للبحث.', 'No invoices match your search.')}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
