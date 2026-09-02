import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';

const Clients = () => {
  const { t, isRTL, clients, addClient, updateClient, deleteClient, invoices } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  const handleOpenModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({ name: '', email: '', phone: '', address: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
  };

  const handleSave = () => {
    if (!formData.name) return;
    
    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      addClient({ id: Date.now().toString(), ...formData });
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm(t('هل أنت متأكد من حذف هذا العميل؟', 'Are you sure you want to delete this client?'))) {
      deleteClient(id);
    }
  };

  return (
    <div className={`p-6 max-w-7xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('العملاء', 'Clients')}</h1>
        <Button onClick={() => handleOpenModal()}>+ {t('إضافة عميل', 'Add Client')}</Button>
      </div>

      {clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => {
            const clientInvoicesCount = invoices.filter(inv => inv.clientName === client.name).length;
            
            return (
              <div key={client.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-xl mb-4 text-gray-800">{client.name}</h3>
                
                <div className="space-y-2 mb-6 text-sm text-gray-600">
                  {client.email && <p className="flex items-center gap-2">📧 <span dir="ltr">{client.email}</span></p>}
                  {client.phone && <p className="flex items-center gap-2">📱 <span dir="ltr">{client.phone}</span></p>}
                  {client.address && <p className="flex items-center gap-2">📍 <span>{client.address}</span></p>}
                  <p className="flex items-center gap-2 mt-4 pt-4 border-t">
                    🧾 <span className="font-medium text-gray-800">{clientInvoicesCount} {t('فواتير', 'Invoices')}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1" onClick={() => handleOpenModal(client)}>
                    {t('تعديل', 'Edit')}
                  </Button>
                  <Button variant="danger" className="flex-1" onClick={() => handleDelete(client.id)}>
                    {t('حذف', 'Delete')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-500 mb-4">{t('لا يوجد عملاء مضافين.', 'No clients added yet.')}</p>
          <Button onClick={() => handleOpenModal()}>{t('إضافة عميلك الأول', 'Add Your First Client')}</Button>
        </div>
      )}

      {showModal && (
        <Modal 
          title={editingClient ? t('تعديل العميل', 'Edit Client') : t('إضافة عميل', 'Add Client')}
          onClose={handleCloseModal}
        >
          <div className="space-y-4 min-w-[300px] sm:min-w-[400px]">
            <Input label={t('الاسم', 'Name')} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <Input label={t('البريد الإلكتروني', 'Email')} type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <Input label={t('رقم الهاتف', 'Phone')} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <Input label={t('العنوان', 'Address')} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">{t('حفظ', 'Save')}</Button>
              <Button onClick={handleCloseModal} variant="secondary" className="flex-1">{t('إلغاء', 'Cancel')}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Clients;
