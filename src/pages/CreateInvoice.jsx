import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, generateInvoiceNumber } from '../utils/formatters';
import { calculateInvoiceTotals } from '../utils/calculations';
import { generatePDF } from '../utils/pdfGenerator';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const CreateInvoice = () => {
  const { t, isRTL, settings, clients, addInvoice } = useApp();
  const navigate = useNavigate();

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [manualClient, setManualClient] = useState({ name: '', email: '', phone: '', address: '' });
  
  const [items, setItems] = useState([{ id: Date.now(), description: '', quantity: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(settings?.taxRate || 15);
  const [discountRate, setDiscountRate] = useState(0);
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setInvoiceNumber(generateInvoiceNumber());
  }, []);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totals = calculateInvoiceTotals(items, taxRate, discountRate);

  const handleSave = () => {
    const clientData = selectedClient ? clients.find(c => c.id === selectedClient) : manualClient;
    const newInvoice = {
      id: Date.now().toString(),
      invoiceNumber,
      date,
      dueDate,
      clientName: clientData.name,
      clientEmail: clientData.email,
      clientPhone: clientData.phone,
      clientAddress: clientData.address,
      items,
      taxRate,
      discountRate,
      notes,
      ...totals,
      status: 'pending'
    };
    addInvoice(newInvoice);
    navigate('/invoices');
  };

  const activeClient = selectedClient ? clients.find(c => c.id === selectedClient) : manualClient;

  return (
    <div className={`p-6 max-w-screen-2xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{t('إنشاء فاتورة', 'Create Invoice')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4">{t('معلومات العميل', 'Client Info')}</h2>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">{t('اختر عميلاً', 'Select Client')}</label>
              <select 
                className="w-full border rounded-lg p-2"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <option value="">{t('إدخال يدوي', 'Manual Input')}</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {!selectedClient && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label={t('الاسم', 'Name')} value={manualClient.name} onChange={(e) => setManualClient({...manualClient, name: e.target.value})} />
                <Input label={t('البريد الإلكتروني', 'Email')} type="email" value={manualClient.email} onChange={(e) => setManualClient({...manualClient, email: e.target.value})} />
                <Input label={t('رقم الهاتف', 'Phone')} value={manualClient.phone} onChange={(e) => setManualClient({...manualClient, phone: e.target.value})} />
                <Input label={t('العنوان', 'Address')} value={manualClient.address} onChange={(e) => setManualClient({...manualClient, address: e.target.value})} />
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">{t('تفاصيل الفاتورة', 'Invoice Details')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label={t('رقم الفاتورة', 'Invoice #')} value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
              <Input label={t('التاريخ', 'Date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <Input label={t('تاريخ الاستحقاق', 'Due Date')} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">{t('العناصر', 'Items')}</h2>
            {items.map((item, index) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 mb-4 items-end border-b pb-4">
                <div className="flex-1">
                  <Input label={t('الوصف', 'Description')} value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} />
                </div>
                <div className="w-24">
                  <Input label={t('الكمية', 'Qty')} type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))} />
                </div>
                <div className="w-32">
                  <Input label={t('السعر', 'Price')} type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', Number(e.target.value))} />
                </div>
                <div className="w-32 py-2">
                  <span className="font-bold">{formatCurrency(item.quantity * item.price, settings?.currency, isRTL ? 'ar' : 'en')}</span>
                </div>
                <Button onClick={() => handleRemoveItem(item.id)} variant="danger">{t('حذف', 'Delete')}</Button>
              </div>
            ))}
            <Button onClick={handleAddItem} variant="secondary" className="w-full">{t('إضافة عنصر', 'Add Item')}</Button>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <Input label={t('نسبة الضريبة (%)', 'Tax Rate (%)')} type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
            <Input label={t('نسبة الخصم (%)', 'Discount Rate (%)')} type="number" value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))} />
          </section>
          
          <section>
            <label className="block mb-2 text-sm font-medium">{t('ملاحظات', 'Notes')}</label>
            <textarea className="w-full border rounded-lg p-2 h-24" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </section>

          <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-end">
            <div className="w-full sm:w-1/2 space-y-2">
              <div className="flex justify-between"><span>{t('المجموع الفرعي', 'Subtotal')}:</span> <span>{formatCurrency(totals.subtotal, settings?.currency, isRTL ? 'ar' : 'en')}</span></div>
              <div className="flex justify-between text-red-500"><span>{t('الخصم', 'Discount')}:</span> <span>-{formatCurrency(totals.discount, settings?.currency, isRTL ? 'ar' : 'en')}</span></div>
              <div className="flex justify-between text-gray-500"><span>{t('الضريبة', 'Tax')}:</span> <span>+{formatCurrency(totals.tax, settings?.currency, isRTL ? 'ar' : 'en')}</span></div>
              <div className="flex justify-between font-bold text-xl pt-2 border-t mt-2">
                <span>{t('الإجمالي', 'TOTAL')}:</span> <span>{formatCurrency(totals.total, settings?.currency, isRTL ? 'ar' : 'en')}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} className="flex-1">{t('حفظ الفاتورة', 'Save Invoice')}</Button>
            <Button 
              onClick={() => generatePDF('invoice-preview', invoiceNumber)} 
              variant="secondary" 
              className="flex-1"
            >
              {t('📥 تحميل PDF', '📥 Download PDF')}
            </Button>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div className="bg-gray-100 rounded-2xl p-6 overflow-auto border">
          <div id="invoice-preview" className="bg-white p-8 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg text-gray-800" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-start border-b pb-8 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{settings?.companyName || 'Company Name'}</h2>
                <p className="text-gray-500 mt-2 whitespace-pre-line">{settings?.companyAddress}</p>
                <p className="text-gray-500">{settings?.companyEmail}</p>
                <p className="text-gray-500">{settings?.companyPhone}</p>
              </div>
              <div className={isRTL ? 'text-left' : 'text-right'}>
                <h1 className="text-4xl font-light text-blue-600 mb-2">{t('فاتورة', 'INVOICE')}</h1>
                <p><strong>{t('رقم', '#')}:</strong> {invoiceNumber}</p>
                <p><strong>{t('التاريخ', 'Date')}:</strong> {formatDate(date, settings?.calendar, isRTL ? 'ar' : 'en')}</p>
                {dueDate && <p><strong>{t('تاريخ الاستحقاق', 'Due Date')}:</strong> {formatDate(dueDate, settings?.calendar, isRTL ? 'ar' : 'en')}</p>}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-gray-700 mb-2 border-b inline-block">{t('إلى', 'Bill To')}:</h3>
              <p className="font-semibold text-lg">{activeClient?.name || 'Client Name'}</p>
              {activeClient?.address && <p className="text-gray-600">{activeClient.address}</p>}
              {activeClient?.email && <p className="text-gray-600">{activeClient.email}</p>}
              {activeClient?.phone && <p className="text-gray-600">{activeClient.phone}</p>}
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>#</th>
                  <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>{t('الوصف', 'Description')}</th>
                  <th className="p-3 text-center">{t('الكمية', 'Qty')}</th>
                  <th className={`p-3 ${isRTL ? 'text-left' : 'text-right'}`}>{t('السعر', 'Price')}</th>
                  <th className={`p-3 ${isRTL ? 'text-left' : 'text-right'}`}>{t('المجموع', 'Total')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3">{item.description}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className={`p-3 ${isRTL ? 'text-left' : 'text-right'}`}>{formatCurrency(item.price, settings?.currency, isRTL ? 'ar' : 'en')}</td>
                    <td className={`p-3 ${isRTL ? 'text-left' : 'text-right'}`}>{formatCurrency(item.quantity * item.price, settings?.currency, isRTL ? 'ar' : 'en')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mb-8">
              <div className="w-1/2">
                <div className="flex justify-between py-2"><span className="text-gray-600">{t('المجموع الفرعي', 'Subtotal')}:</span> <span>{formatCurrency(totals.subtotal, settings?.currency, isRTL ? 'ar' : 'en')}</span></div>
                {totals.discount > 0 && <div className="flex justify-between py-2"><span className="text-gray-600">{t('الخصم', 'Discount')} ({discountRate}%):</span> <span>-{formatCurrency(totals.discount, settings?.currency, isRTL ? 'ar' : 'en')}</span></div>}
                {totals.tax > 0 && <div className="flex justify-between py-2"><span className="text-gray-600">{t('الضريبة', 'Tax')} ({taxRate}%):</span> <span>{formatCurrency(totals.tax, settings?.currency, isRTL ? 'ar' : 'en')}</span></div>}
                <div className="flex justify-between py-3 border-t-2 border-gray-800 font-bold text-xl mt-2">
                  <span>{t('الإجمالي', 'Total')}:</span> <span className="text-blue-600">{formatCurrency(totals.total, settings?.currency, isRTL ? 'ar' : 'en')}</span>
                </div>
              </div>
            </div>

            {notes && (
              <div className="mt-12 text-sm text-gray-500">
                <p className="font-bold text-gray-700 mb-1">{t('ملاحظات', 'Notes')}:</p>
                <p className="whitespace-pre-line">{notes}</p>
              </div>
            )}

            {/* Signature and Stamp Section */}
            {(settings?.signature || settings?.stamp) && (
              <div className="mt-16 flex justify-between items-end border-t pt-8" style={{ pageBreakInside: 'avoid' }}>
                {settings?.signature && (
                  <div className="text-center">
                    <p className="font-bold text-gray-700 mb-2">{t('توقيع الموظف المعتمد', 'Authorized Signature')}</p>
                    <img src={settings.signature} alt="Signature" className="h-16 object-contain mx-auto" />
                  </div>
                )}
                {settings?.stamp && (
                  <div className="text-center">
                    <p className="font-bold text-gray-700 mb-2">{t('ختم المؤسسة', 'Company Stamp')}</p>
                    <img src={settings.stamp} alt="Stamp" className="h-20 object-contain mx-auto" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
