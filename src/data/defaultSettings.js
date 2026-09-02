/**
 * الإعدادات الافتراضية لنظام إنشاء الفواتير
 * Default settings for Invoice Generator
 */
export const defaultSettings = {
  companyName: 'اسم الشركة',
  companyEmail: 'info@company.com',
  companyPhone: '+966 50 000 0000',
  companyAddress: 'الرياض، المملكة العربية السعودية',
  taxNumber: '300000000000003',
  currency: 'SAR',
  taxRate: 15,
  calendar: 'gregorian',
  discountRate: 0,
  logo: '',
  signature: '',
  stamp: '',
  notes: 'شكراً لتعاملكم معنا!',
  terms: 'يجب سداد المبلغ المستحق خلال 30 يوماً من تاريخ إصدار الفاتورة.',
};

export default defaultSettings;
