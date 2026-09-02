/**
 * دوال الحسابات المالية لفواتير النظام
 * Financial Calculation Utilities for Invoice Generator
 */

/**
 * حساب المجموع الفرعي لبنود الفاتورة
 * @param {Array<{quantity: number, price: number}>} items - قائمة بنود الفاتورة
 * @returns {number} المجموع الفرعي (مجموع الكمية * السعر لكل بند)
 */
export const calculateSubtotal = (items = []) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const quantity = Number(item?.quantity) || 0;
    const price = Number(item?.price) || 0;
    return sum + (quantity * price);
  }, 0);
};

/**
 * حساب قيمة الضريبة بناءً على المجموع الفرعي ونسبة الضريبة
 * @param {number} subtotal - المجموع الفرعي
 * @param {number} taxRate - نسبة الضريبة المئوية (مثلاً: 15 لـ 15%)
 * @returns {number} قيمة الضريبة
 */
export const calculateTax = (subtotal = 0, taxRate = 0) => {
  const validSubtotal = Number(subtotal) || 0;
  const validTaxRate = Number(taxRate) || 0;
  return (validSubtotal * validTaxRate) / 100;
};

/**
 * حساب قيمة الخصم بناءً على المجموع الفرعي ونسبة الخصم
 * @param {number} subtotal - المجموع الفرعي
 * @param {number} discountRate - نسبة الخصم المئوية
 * @returns {number} قيمة الخصم
 */
export const calculateDiscount = (subtotal = 0, discountRate = 0) => {
  const validSubtotal = Number(subtotal) || 0;
  const validDiscountRate = Number(discountRate) || 0;
  return (validSubtotal * validDiscountRate) / 100;
};

/**
 * حساب الإجمالي النهائي بعد إضافة الضريبة وخصم التخفيض
 * @param {number} subtotal - المجموع الفرعي
 * @param {number} tax - قيمة الضريبة
 * @param {number} discount - قيمة الخصم
 * @returns {number} الإجمالي النهائي
 */
export const calculateTotal = (subtotal = 0, tax = 0, discount = 0) => {
  const validSubtotal = Number(subtotal) || 0;
  const validTax = Number(tax) || 0;
  const validDiscount = Number(discount) || 0;
  return Math.max(0, validSubtotal + validTax - validDiscount);
};

/**
 * حساب جميع إجماليات الفاتورة دفعة واحدة
 * @param {Array<{quantity: number, price: number}>} items - قائمة البنود
 * @param {number} taxRate - نسبة الضريبة (%)
 * @param {number} discountRate - نسبة الخصم (%)
 * @returns {{subtotal: number, tax: number, discount: number, total: number}} كائن يحتوي على كافة المجاميع
 */
export const calculateInvoiceTotals = (items = [], taxRate = 0, discountRate = 0) => {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, taxRate);
  const discount = calculateDiscount(subtotal, discountRate);
  const total = calculateTotal(subtotal, tax, discount);

  return {
    subtotal,
    tax,
    discount,
    total,
  };
};
