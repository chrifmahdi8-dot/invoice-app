import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const Settings = () => {
  const { t, isRTL, language, setLanguage, settings, updateSettings } = useApp();
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    logo: '',
    signature: '',
    stamp: '',
    currency: 'SAR',
    taxRate: 15,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <div className={`p-6 max-w-4xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{t('الإعدادات', 'Settings')}</h1>

      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{t('تم حفظ الإعدادات بنجاح.', 'Settings saved successfully.')}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Company Info */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">{t('معلومات الشركة', 'Company Info')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('اسم الشركة', 'Company Name')} value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
            <Input label={t('البريد الإلكتروني', 'Email')} type="email" value={formData.companyEmail} onChange={e => setFormData({...formData, companyEmail: e.target.value})} />
            <Input label={t('رقم الهاتف', 'Phone')} value={formData.companyPhone} onChange={e => setFormData({...formData, companyPhone: e.target.value})} />
            <Input label={t('رابط الشعار', 'Logo URL')} value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} />
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium">{t('العنوان', 'Address')}</label>
              <textarea 
                className="w-full border rounded-lg p-2 h-24" 
                value={formData.companyAddress} 
                onChange={e => setFormData({...formData, companyAddress: e.target.value})} 
              />
            </div>
            {formData.logo && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-2">{t('معاينة الشعار', 'Logo Preview')}:</p>
                <img src={formData.logo} alt="Logo preview" className="h-16 object-contain" />
              </div>
            )}
            
            <Input label={t('رابط الإمضاء', 'Signature URL')} value={formData.signature} onChange={e => setFormData({...formData, signature: e.target.value})} />
            <Input label={t('رابط الختم', 'Stamp URL')} value={formData.stamp} onChange={e => setFormData({...formData, stamp: e.target.value})} />

            {(formData.signature || formData.stamp) && (
              <div className="md:col-span-2 grid grid-cols-2 gap-4 mt-2 border-t pt-4">
                {formData.signature && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">{t('معاينة الإمضاء', 'Signature Preview')}:</p>
                    <img src={formData.signature} alt="Signature preview" className="h-16 object-contain" />
                  </div>
                )}
                {formData.stamp && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">{t('معاينة الختم', 'Stamp Preview')}:</p>
                    <img src={formData.stamp} alt="Stamp preview" className="h-16 object-contain" />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Invoice Settings */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">{t('إعدادات الفواتير', 'Invoice Settings')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">{t('العملة', 'Currency')}</label>
              <select 
                className="w-full border rounded-lg p-2"
                value={formData.currency}
                onChange={e => setFormData({...formData, currency: e.target.value})}
              >
                <optgroup label={t('عملات دولية', 'International')}>
                  <option value="USD">USD - {t('دولار أمريكي', 'US Dollar')}</option>
                  <option value="EUR">EUR - {t('يورو', 'Euro')}</option>
                </optgroup>
                <optgroup label={t('الخليج العربي', 'Gulf States')}>
                  <option value="SAR">SAR - {t('ريال سعودي', 'Saudi Riyal')}</option>
                  <option value="AED">AED - {t('درهم إماراتي', 'UAE Dirham')}</option>
                  <option value="KWD">KWD - {t('دينار كويتي', 'Kuwaiti Dinar')}</option>
                  <option value="BHD">BHD - {t('دينار بحريني', 'Bahraini Dinar')}</option>
                  <option value="OMR">OMR - {t('ريال عماني', 'Omani Rial')}</option>
                  <option value="QAR">QAR - {t('ريال قطري', 'Qatari Riyal')}</option>
                </optgroup>
                <optgroup label={t('شمال أفريقيا', 'North Africa')}>
                  <option value="EGP">EGP - {t('جنيه مصري', 'Egyptian Pound')}</option>
                  <option value="LYD">LYD - {t('دينار ليبي', 'Libyan Dinar')}</option>
                  <option value="TND">TND - {t('دينار تونسي', 'Tunisian Dinar')}</option>
                  <option value="DZD">DZD - {t('دينار جزائري', 'Algerian Dinar')}</option>
                  <option value="MAD">MAD - {t('درهم مغربي', 'Moroccan Dirham')}</option>
                  <option value="SDG">SDG - {t('جنيه سوداني', 'Sudanese Pound')}</option>
                  <option value="MRU">MRU - {t('أوقية موريتانية', 'Mauritanian Ouguiya')}</option>
                </optgroup>
                <optgroup label={t('الشام والعراق', 'Levant & Iraq')}>
                  <option value="JOD">JOD - {t('دينار أردني', 'Jordanian Dinar')}</option>
                  <option value="IQD">IQD - {t('دينار عراقي', 'Iraqi Dinar')}</option>
                  <option value="LBP">LBP - {t('ليرة لبنانية', 'Lebanese Pound')}</option>
                  <option value="SYP">SYP - {t('ليرة سورية', 'Syrian Pound')}</option>
                  <option value="ILS">ILS - {t('شيكل', 'Israeli Shekel')}</option>
                </optgroup>
                <optgroup label={t('أخرى', 'Other')}>
                  <option value="YER">YER - {t('ريال يمني', 'Yemeni Rial')}</option>
                  <option value="SOS">SOS - {t('شلن صومالي', 'Somali Shilling')}</option>
                  <option value="DJF">DJF - {t('فرنك جيبوتي', 'Djiboutian Franc')}</option>
                  <option value="KMF">KMF - {t('فرنك قمري', 'Comorian Franc')}</option>
                </optgroup>
              </select>
            </div>
            <Input label={t('نسبة الضريبة الافتراضية (%)', 'Default Tax Rate (%)')} type="number" value={formData.taxRate} onChange={e => setFormData({...formData, taxRate: Number(e.target.value)})} />
            <div>
              <label className="block mb-2 text-sm font-medium">{t('التقويم', 'Calendar')}</label>
              <select 
                className="w-full border rounded-lg p-2"
                value={formData.calendar || 'gregorian'}
                onChange={e => setFormData({...formData, calendar: e.target.value})}
              >
                <option value="gregorian">{t('ميلادي (Gregorian)', 'Gregorian')}</option>
                <option value="hijri">{t('هجري (Hijri)', 'Hijri')}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Language Section */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">{t('اللغة', 'Language')}</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t('اللغة الحالية', 'Current Language')}: <span className="text-blue-600">{language === 'ar' ? 'العربية' : 'English'}</span></p>
            </div>
            <Button onClick={toggleLanguage} variant="secondary">
              {t('التبديل إلى الإنجليزية', 'Switch to Arabic')}
            </Button>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} className="px-8 py-3 text-lg">{t('حفظ الإعدادات', 'Save Settings')}</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
