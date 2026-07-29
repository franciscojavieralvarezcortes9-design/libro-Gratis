import jsPDF from 'jspdf';
import { BOOK_INFO, CHAPTERS } from '../data/bookData';
import { DownloadFormat } from '../types';

export const downloadBookInFormat = async (
  format: DownloadFormat,
  onProgress?: (percent: number) => void
): Promise<void> => {
  if (onProgress) onProgress(10);

  if (format === 'pdf') {
    await generatePDF(onProgress);
  } else if (format === 'epub') {
    generateEPUB(onProgress);
  } else if (format === 'txt') {
    generateTXT(onProgress);
  } else if (format === 'html') {
    generateOfflineHTML(onProgress);
  }
};

const generatePDF = async (onProgress?: (percent: number) => void) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Cover Page
  doc.setFillColor(15, 17, 21); // Dark luxury background
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Cover Title & Header
  doc.setTextColor(245, 245, 245);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text(BOOK_INFO.title, pageWidth / 2, 60, { align: 'center' });

  doc.setTextColor(212, 175, 55); // Gold accent
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  const subtitleLines = doc.splitTextToSize(BOOK_INFO.subtitle, contentWidth - 10);
  doc.text(subtitleLines, pageWidth / 2, 80, { align: 'center' });

  doc.setTextColor(180, 180, 185);
  doc.setFontSize(11);
  const taglineLines = doc.splitTextToSize(BOOK_INFO.authorTagline, contentWidth - 10);
  doc.text(taglineLines, pageWidth / 2, 110, { align: 'center' });

  // Decorative border box
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.rect(margin, 35, contentWidth, pageHeight - 70);

  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('EDICIÓN DIGITAL GRATUITA — LECTURA LIBRE', pageWidth / 2, pageHeight - 45, { align: 'center' });
  doc.text('58 Páginas • 19 Capítulos • Psicología & Neurociencia', pageWidth / 2, pageHeight - 38, { align: 'center' });

  if (onProgress) onProgress(25);

  // Table of Contents Page
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  let y = 30;
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('ÍNDICE', margin, y);
  y += 15;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  CHAPTERS.forEach((ch, idx) => {
    if (y > pageHeight - 25) {
      doc.addPage();
      y = 30;
    }

    const titleStr = ch.number ? `${ch.number}. ${ch.title}` : ch.title;
    const dots = '.'.repeat(Math.max(5, Math.floor((contentWidth - titleStr.length * 2.2) / 3)));
    
    doc.setTextColor(30, 30, 30);
    doc.text(titleStr, margin, y);
    doc.setTextColor(160, 160, 160);
    doc.text(`pág. ${ch.startPage}`, pageWidth - margin, y, { align: 'right' });
    
    y += 7;
  });

  if (onProgress) onProgress(40);

  // Chapters Content
  let totalSteps = CHAPTERS.length;
  CHAPTERS.forEach((ch, chIdx) => {
    doc.addPage();
    y = 30;

    // Chapter Header
    doc.setTextColor(180, 83, 9); // Amber gold
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(ch.number ? `CAPÍTULO ${ch.number}` : ch.category.toUpperCase(), margin, y);
    y += 8;

    doc.setTextColor(20, 20, 25);
    doc.setFontSize(18);
    const titleLines = doc.splitTextToSize(ch.title, contentWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 8 + 6;

    // Divider
    doc.setDrawColor(220, 220, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Paragraphs
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(40, 40, 45);

    ch.paragraphs.forEach((p) => {
      const pLines = doc.splitTextToSize(p, contentWidth);
      const neededHeight = pLines.length * 5.5 + 4;

      if (y + neededHeight > pageHeight - 20) {
        // Add page footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(ch.title, margin, pageHeight - 10);
        doc.text(`El Sistema Invisible`, pageWidth - margin, pageHeight - 10, { align: 'right' });

        doc.addPage();
        y = 25;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(40, 40, 45);
      }

      doc.text(pLines, margin, y);
      y += pLines.length * 5.5 + 5;
    });

    // Page footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(ch.title, margin, pageHeight - 10);
    doc.text(`El Sistema Invisible`, pageWidth - margin, pageHeight - 10, { align: 'right' });

    if (onProgress) {
      onProgress(Math.floor(40 + ((chIdx + 1) / totalSteps) * 55));
    }
  });

  if (onProgress) onProgress(100);

  doc.save('El_Sistema_Invisible_Libro.pdf');
};

const generateTXT = (onProgress?: (percent: number) => void) => {
  let content = `==================================================\n`;
  content += `${BOOK_INFO.title}\n`;
  content += `${BOOK_INFO.subtitle}\n`;
  content += `${BOOK_INFO.authorTagline}\n`;
  content += `==================================================\n\n`;

  content += `ÍNDICE\n--------------------------------------------------\n`;
  CHAPTERS.forEach((ch) => {
    content += `${ch.number ? `Capítulo ${ch.number}: ` : ''}${ch.title}\n`;
  });
  content += `--------------------------------------------------\n\n`;

  CHAPTERS.forEach((ch) => {
    content += `\n\n==================================================\n`;
    content += `${ch.number ? `CAPÍTULO ${ch.number}\n` : ''}${ch.title}\n`;
    content += `==================================================\n\n`;

    ch.paragraphs.forEach((p) => {
      content += `${p}\n\n`;
    });
  });

  if (onProgress) onProgress(100);

  triggerDownload(content, 'El_Sistema_Invisible_Libro.txt', 'text/plain;charset=utf-8');
};

const generateEPUB = (onProgress?: (percent: number) => void) => {
  // Generate HTML-backed EPUB structured document
  let html = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta charset="utf-8"/>
  <title>${BOOK_INFO.title}</title>
  <style>
    body { font-family: Georgia, serif; line-height: 1.6; padding: 2em; color: #222; }
    h1 { text-align: center; color: #111; margin-bottom: 0.2em; }
    h2 { text-align: center; color: #b45309; font-weight: normal; margin-top: 0; }
    .subtitle { text-align: center; font-style: italic; color: #555; margin-bottom: 2em; }
    .chapter { page-break-before: always; margin-top: 3em; }
    .chapter-num { text-transform: uppercase; color: #b45309; font-size: 0.9em; font-weight: bold; }
    p { text-indent: 1.5em; margin: 0.5em 0; text-align: justify; }
  </style>
</head>
<body>
  <h1>${BOOK_INFO.title}</h1>
  <h2>${BOOK_INFO.subtitle}</h2>
  <p class="subtitle">${BOOK_INFO.authorTagline}</p>
  <hr/>
`;

  CHAPTERS.forEach((ch) => {
    html += `<div class="chapter">
      ${ch.number ? `<div class="chapter-num">Capítulo ${ch.number}</div>` : ''}
      <h2>${ch.title}</h2>
`;
    ch.paragraphs.forEach((p) => {
      html += `      <p>${p}</p>\n`;
    });
    html += `    </div>\n`;
  });

  html += `</body>\n</html>`;

  if (onProgress) onProgress(100);

  triggerDownload(html, 'El_Sistema_Invisible_Libro.epub', 'application/epub+zip');
};

const generateOfflineHTML = (onProgress?: (percent: number) => void) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BOOK_INFO.title} - Lector Offline</title>
  <style>
    :root {
      --bg: #121318;
      --text: #e2e8f0;
      --accent: #f59e0b;
      --card: #1c1e26;
      --muted: #94a3b8;
    }
    body {
      margin: 0;
      padding: 0;
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.8;
    }
    header {
      position: sticky;
      top: 0;
      background: rgba(18, 19, 24, 0.9);
      backdrop-filter: blur(10px);
      padding: 12px 20px;
      border-bottom: 1px solid #2e3240;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 100;
    }
    h1 { font-size: 1.1rem; margin: 0; color: var(--accent); }
    .container { max-width: 680px; margin: 0 auto; padding: 20px 16px 80px; }
    .hero { text-align: center; margin-bottom: 40px; }
    .hero h2 { font-size: 2rem; margin-bottom: 8px; }
    .chapter-card {
      background: var(--card);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      border: 1px solid #2d313e;
    }
    .chapter-title { color: var(--accent); font-size: 1.4rem; margin-top: 0; }
    p { font-size: 1.05rem; margin-bottom: 1.2rem; }
    .nav-btn {
      background: var(--accent);
      color: #000;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <header>
    <h1>${BOOK_INFO.title}</h1>
    <span style="font-size: 0.85rem; color: var(--muted);">Lector Offline Móvil</span>
  </header>
  <div class="container">
    <div class="hero">
      <h2>${BOOK_INFO.title}</h2>
      <p style="color: var(--muted);">${BOOK_INFO.subtitle}</p>
    </div>
    ${CHAPTERS.map(ch => `
      <div class="chapter-card" id="${ch.id}">
        ${ch.number ? `<div style="color: var(--accent); font-weight: bold; font-size: 0.85rem;">CAPÍTULO ${ch.number}</div>` : ''}
        <h3 class="chapter-title">${ch.title}</h3>
        ${ch.paragraphs.map(p => `<p>${p}</p>`).join('')}
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  if (onProgress) onProgress(100);

  triggerDownload(htmlContent, 'El_Sistema_Invisible_Lector_Offline.html', 'text/html;charset=utf-8');
};

const triggerDownload = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
