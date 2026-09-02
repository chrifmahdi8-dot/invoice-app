import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePDF = async (elementId, fileName = 'فاتورة.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return false;

  try {
    // التقاط صورة للعنصر
    const canvas = await html2canvas(element, {
      scale: 2, // جودة أعلى
      useCORS: true, // للسماح بتحميل الصور الخارجية (مثل اللوجو)
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 2000, // لتجنب التجميد إذا كانت الصورة معطوبة
    });
    
    // تحويل الكانفاس إلى صورة
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    
    // إنشاء ملف PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // إضافة الصورة للـ PDF وتحميله
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
