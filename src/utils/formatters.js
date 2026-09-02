/**
 * دوال التنسيق للعملات، التواريخ، وأرقام الفواتير
 * Formatting Utilities for Currency, Dates, and Invoice Numbers
 */

/**
 * تنسيق المبلغ المالي وفق العملة واللغة المحددة
 * @param {number} amount - المبلغ المراد تنسيقه
 * @param {string} currency - رمز العملة (الافتراضي: SAR)
 * @param {string} locale - اللغة/الدولة لتنسيق الأرقام (الافتراضي: ar)
 * @returns {string} النص المنسق للعملة
 */
export const formatCurrency = (amount = 0, currency = 'SAR', locale = 'ar') => {
  const validAmount = Number(amount) || 0;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(validAmount);
  } catch (error) {
    // في حال عدم دعم العملة أو الكود، استخدام تنسيق احتياطي
    return `${validAmount.toFixed(2)} ${currency}`;
  }
};

/**
 * تنسيق التاريخ حسب التقويم المختار
 * @param {Date|string|number} date - التاريخ المراد تنسيقه
 * @param {string} calendar - نوع التقويم: 'gregorian' أو 'hijri'
 * @param {string} language - اللغة: 'ar' أو 'en'
 * @returns {string} التاريخ المنسق كنص
 */
export const formatDate = (date, calendar = 'gregorian', language = 'ar') => {
  if (!date) return '';
  const parsedDate = date instanceof Date ? date : new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return '';
  }

  try {
    // تحديد اللغة والتقويم
    let locale;
    if (calendar === 'hijri') {
      locale = language === 'ar' ? 'ar-SA-u-ca-islamic' : 'en-u-ca-islamic';
    } else {
      locale = language === 'ar' ? 'ar-u-ca-gregory' : 'en-US';
    }

    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(parsedDate);
  } catch (error) {
    return parsedDate.toLocaleDateString();
  }
};

/**
 * توليد رقم فاتورة فريد بتنسيق: INV-YYYYMMDD-XXXX
 * مثال: INV-20260902-1234
 * @returns {string} رقم الفاتورة المولد
 */
export const generateInvoiceNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  // توليد 4 أرقام عشوائية بين 1000 و 9999
  const random4Digits = Math.floor(1000 + Math.random() * 9000);

  return `INV-${year}${month}${day}-${random4Digits}`;
};
