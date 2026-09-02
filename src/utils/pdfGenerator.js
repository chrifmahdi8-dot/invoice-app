/**
 * دالة تصدير الفاتورة كملف PDF باستخدام طباعة المتصفح المدمجة
 * أسرع وأكثر استقراراً من html2pdf.js - لا تجمد المتصفح
 *
 * @param {string} elementId - معرّف العنصر (ID) المراد طباعته
 * @param {string} fileName - اسم الملف (يظهر كعنوان في نافذة الطباعة)
 */
export const generatePDF = (elementId, fileName = 'invoice') => {
  const element = document.getElementById(elementId);

  if (!element) {
    alert('خطأ: لم يتم العثور على عنصر المعاينة');
    return;
  }

  // إنشاء نافذة طباعة جديدة
  const printWindow = window.open('', '_blank', 'width=800,height=600');

  if (!printWindow) {
    alert('يرجى السماح بالنوافذ المنبثقة (Pop-ups) لتحميل الفاتورة');
    return;
  }

  // نسخ محتوى الفاتورة مع أنماط احترافية
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>${fileName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
          color: #1f2937;
          background: white;
          padding: 40px;
          direction: rtl;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid #e5e7eb;
          padding-bottom: 30px;
          margin-bottom: 30px;
        }

        .company-name {
          font-size: 26px;
          font-weight: 700;
          color: #1f2937;
        }

        .company-details {
          color: #6b7280;
          margin-top: 8px;
          line-height: 1.8;
        }

        .invoice-title {
          font-size: 36px;
          font-weight: 300;
          color: #2563eb;
          margin-bottom: 8px;
        }

        .invoice-meta {
          text-align: left;
          line-height: 2;
        }

        .invoice-meta strong {
          color: #374151;
        }

        .client-section {
          margin-bottom: 30px;
        }

        .section-label {
          font-weight: 700;
          color: #374151;
          border-bottom: 2px solid #374151;
          display: inline-block;
          margin-bottom: 10px;
          padding-bottom: 4px;
        }

        .client-name {
          font-size: 18px;
          font-weight: 600;
        }

        .client-details {
          color: #6b7280;
          line-height: 1.8;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }

        thead tr {
          background: #f3f4f6;
        }

        th {
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          text-align: right;
          border-bottom: 2px solid #e5e7eb;
        }

        th:nth-child(3) {
          text-align: center;
        }

        th:nth-child(4),
        th:nth-child(5) {
          text-align: left;
        }

        td {
          padding: 12px 16px;
          font-size: 14px;
          border-bottom: 1px solid #f3f4f6;
        }

        td:nth-child(3) {
          text-align: center;
        }

        td:nth-child(4),
        td:nth-child(5) {
          text-align: left;
        }

        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
        }

        .totals-box {
          width: 50%;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }

        .total-row-label {
          color: #6b7280;
        }

        .total-final {
          border-top: 3px solid #1f2937;
          margin-top: 8px;
          padding-top: 12px;
          font-weight: 700;
          font-size: 20px;
        }

        .total-final-amount {
          color: #2563eb;
        }

        .notes-section {
          margin-top: 40px;
          font-size: 13px;
          color: #6b7280;
        }

        .notes-label {
          font-weight: 700;
          color: #374151;
          margin-bottom: 6px;
        }

        @media print {
          body {
            padding: 20px;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      </style>
    </head>
    <body>
      ${element.innerHTML}
    </body>
    </html>
  `);

  printWindow.document.close();

  // انتظار تحميل المحتوى ثم الطباعة
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 250);
  };
};
