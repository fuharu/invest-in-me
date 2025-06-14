import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PDFExportProps {
  formData?: any;
  targetId?: string;
}

export const PDFExport: React.FC<PDFExportProps> = ({ formData, targetId }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      let element: HTMLElement | null = null;
      if (targetId) {
        element = document.getElementById(targetId);
      } else if (formData) {
        // formDataから仮のPDF内容を生成（簡易例）
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
          <h2>教育投資プレゼン資料</h2>
          <p>学校名: ${formData.school || ''}</p>
          <p>学部: ${formData.department || ''}</p>
          <p>学年: ${formData.grade || ''}</p>
          <p>専攻: ${formData.major || ''}</p>
          <p>GPA: ${formData.gpa || ''}</p>
          <p>取得資格: ${formData.certifications || ''}</p>
          <p>プログラミングスキル: ${formData.programming || ''}</p>
          <p>インターン経験: ${formData.internship || ''}</p>
          <p>コンテスト入賞歴: ${formData.contest || ''}</p>
          <p>今取り組んでいること: ${formData.passion || ''}</p>
          <p>将来の目標: ${formData.goal || ''}</p>
          <p>これまでの教育コスト: ${formData.costPast || ''}</p>
          <p>今後の教育コスト: ${formData.costFuture || ''}</p>
        `;
        document.body.appendChild(tempDiv);
        element = tempDiv;
      }
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4の幅
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4の高さ

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save('教育投資プレゼンテーション.pdf');
      if (formData && element && !targetId) {
        document.body.removeChild(element);
      }
    } catch (error) {
      console.error('PDF出力エラー:', error);
      alert('PDFの出力に失敗しました');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToPDF}
      disabled={isExporting}
      className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
    >
      {isExporting ? 'PDF出力中...' : 'PDFをダウンロード'}
    </button>
  );
}; 