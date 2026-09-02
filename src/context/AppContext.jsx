import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultSettings from '../data/defaultSettings';

/**
 * سياق التطبيق العام لإدارة حالة الفواتير والعملاء والإعدادات واللغة
 * Main Application Context for managing invoices, clients, settings, and language
 */
const AppContext = createContext(null);

export function AppProvider({ children }) {
  // 1. حالة الفواتير - Invoices State
  const [invoices, setInvoices] = useState(() => {
    try {
      const savedInvoices = localStorage.getItem('invoices');
      return savedInvoices ? JSON.parse(savedInvoices) : [];
    } catch (error) {
      console.error('Error loading invoices from localStorage:', error);
      return [];
    }
  });

  // 2. حالة العملاء - Clients State
  const [clients, setClients] = useState(() => {
    try {
      const savedClients = localStorage.getItem('clients');
      return savedClients ? JSON.parse(savedClients) : [];
    } catch (error) {
      console.error('Error loading clients from localStorage:', error);
      return [];
    }
  });

  // 3. حالة الإعدادات - Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('settings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      return defaultSettings;
    }
  });

  // 4. حالة اللغة - Language State
  const [language, setLanguage] = useState(() => {
    try {
      const savedLanguage = localStorage.getItem('language');
      return savedLanguage ? savedLanguage : 'ar';
    } catch (error) {
      console.error('Error loading language from localStorage:', error);
      return 'ar';
    }
  });

  // حفظ الفواتير عند التغيير - Save invoices to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('invoices', JSON.stringify(invoices));
    } catch (error) {
      console.error('Error saving invoices to localStorage:', error);
    }
  }, [invoices]);

  // حفظ العملاء عند التغيير - Save clients to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('clients', JSON.stringify(clients));
    } catch (error) {
      console.error('Error saving clients to localStorage:', error);
    }
  }, [clients]);

  // حفظ الإعدادات عند التغيير - Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }, [settings]);

  // حفظ اللغة وتحديث اتجاه المستند عند التغيير - Save language and update document direction
  useEffect(() => {
    try {
      localStorage.setItem('language', language);
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  }, [language]);

  // إضافة فاتورة جديدة - Add new invoice
  const addInvoice = (invoice) => {
    const newInvoice = {
      ...invoice,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: invoice?.status || 'pending',
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  // تعديل فاتورة موجودة - Update existing invoice
  const updateInvoice = (id, updatedInvoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updatedInvoice } : inv))
    );
  };

  // حذف فاتورة - Delete invoice
  const deleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  // إضافة عميل جديد - Add new client
  const addClient = (client) => {
    const newClient = {
      ...client,
      id: Date.now(),
    };
    setClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  // تعديل بيانات عميل - Update client
  const updateClient = (id, updatedClient) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id ? { ...client, ...updatedClient } : client
      )
    );
  };

  // حذف عميل - Delete client
  const deleteClient = (id) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  // تحديث الإعدادات - Merge new settings with existing settings
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  // تبديل اللغة بين العربية والإنجليزية - Toggle language
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'ar' ? 'en' : 'ar'));
  };

  // دالة الترجمة البسيطة - Translation helper function
  const t = (ar, en) => (language === 'ar' ? ar : en);

  // هل الاتجاه من اليمين لليسار - RTL direction helper
  const isRTL = language === 'ar';

  const contextValue = {
    invoices,
    setInvoices,
    clients,
    setClients,
    settings,
    setSettings,
    language,
    setLanguage,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addClient,
    updateClient,
    deleteClient,
    updateSettings,
    toggleLanguage,
    t,
    isRTL,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * خطاف مخصص لاستخدام سياق التطبيق
 * Custom hook to access AppContext
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppProvider;
