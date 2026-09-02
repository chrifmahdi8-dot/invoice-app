import { useState, useEffect } from 'react';

/**
 * خطاف مخصص لإدارة وحفظ الحالة في التخزين المحلي للمتصفح (localStorage)
 * Custom hook to manage state synchronized with localStorage
 * 
 * @param {string} key - مفتاح التخزين في localStorage
 * @param {*} initialValue - القيمة الابتدائية في حال عدم وجود قيمة سابقة
 * @returns {[any, Function]} [storedValue, setValue] - القيمة المخزنة ودالة التحديث
 */
const useLocalStorage = (key, initialValue) => {
  // قراءة القيمة الأولية من التخزين المحلي أو استخدام القيمة الابتدائية
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`خطأ في قراءة المفتاح "${key}" من التخزين المحلي:`, error);
      return initialValue;
    }
  });

  // مزامنة القيمة مع التخزين المحلي عند تغير المفتاح أو القيمة
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`خطأ في حفظ المفتاح "${key}" في التخزين المحلي:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
