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
    
    // إضافة الصورة للـ PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    // الحصول على ملف الـ PDF كـ Blob
    const blob = pdf.output('blob');
    const file = new File([blob], fileName, { type: 'application/pdf' });

    // محاولة استخدام قائمة المشاركة الأصلية في الجوال (Web Share API)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'فاتورة',
        });
      } catch (shareError) {
        if (shareError?.name === 'AbortError') {
          // المستخدم ألغى المشاركة بنفسه، لا داعي لأي إجراء إضافي
          console.log('تم إلغاء المشاركة من قبل المستخدم');
        } else {
          // فشلت المشاركة لسبب آخر، نلجأ للتحميل المباشر بدل ما يبقى المستخدم بلا شيء
          console.log('فشلت المشاركة، سيتم التحميل المباشر:', shareError);
          pdf.save(fileName);
        }
      }
    } else {
      // إذا كان المتصفح لا يدعم المشاركة (مثل الكمبيوتر)، نقوم بالتحميل المباشر
      pdf.save(fileName);
    }
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
