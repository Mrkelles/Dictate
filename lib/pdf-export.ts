import {
  countWordsAndChars,
  formatDuration,
  sanitizeFilename,
} from '@/lib/transcript-utils';
import { DICTATION_LANGUAGES } from '@/lib/types';

export interface PdfTranscriptPayload {
  title: string;
  content: string;
  language?: string;
  durationSeconds?: number;
  updatedAt?: string;
}

function sanitizePdfFilename(title: string): string {
  return sanitizeFilename(title).replace(/\.txt$/i, '.pdf');
}

function getLanguageLabel(code?: string): string {
  if (!code) return 'English (US)';
  return DICTATION_LANGUAGES.find((item) => item.code === code)?.label ?? code;
}

function formatFormalDate(isoDate?: string): string {
  const date = isoDate ? new Date(isoDate) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  return safeDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function exportTranscriptToPdf(
  payload: PdfTranscriptPayload
): Promise<void> {
  const trimmedContent = payload.content.trim();
  if (!trimmedContent) return;

  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 54; // 0.75 in
  const topMargin = 54;
  const bottomMargin = 60;
  const contentWidth = pageWidth - marginX * 2;
  const maxBodyY = pageHeight - bottomMargin;

  const documentTitle = payload.title.trim() || 'Untitled Transcript';
  const formalDate = formatFormalDate(payload.updatedAt);
  const languageLabel = getLanguageLabel(payload.language);
  const { words, characters } = countWordsAndChars(trimmedContent);

  const metaParts: string[] = [
    `Date: ${formalDate}`,
    `Language: ${languageLabel}`,
  ];
  if (payload.durationSeconds && payload.durationSeconds > 0) {
    metaParts.push(`Duration: ${formatDuration(payload.durationSeconds)}`);
  }
  metaParts.push(
    `Length: ${words.toLocaleString()} ${words === 1 ? 'word' : 'words'} (${characters.toLocaleString()} ${characters === 1 ? 'character' : 'characters'})`
  );

  // Top formal accent bar & label
  let cursorY = topMargin;
  doc.setDrawColor(217, 119, 6); // Amber-600 hairline accent
  doc.setLineWidth(1.5);
  doc.line(marginX, cursorY, marginX + 36, cursorY);

  cursorY += 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(113, 113, 122); // Zinc-500
  doc.text('BOOTHSCRIPT TRANSCRIPT', marginX, cursorY);

  // Document title
  cursorY += 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(24, 24, 27); // Zinc-900
  const titleLines = doc.splitTextToSize(documentTitle, contentWidth) as string[];
  const titleLineHeight = 23;
  for (const line of titleLines) {
    doc.text(line, marginX, cursorY);
    cursorY += titleLineHeight;
  }

  // Metadata strip
  cursorY += 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(82, 82, 91); // Zinc-600
  const metaText = metaParts.join('   |   ');
  const metaLines = doc.splitTextToSize(metaText, contentWidth) as string[];
  const metaLineHeight = 14;
  for (const line of metaLines) {
    doc.text(line, marginX, cursorY);
    cursorY += metaLineHeight;
  }

  // Divider rule
  cursorY += 8;
  doc.setDrawColor(228, 228, 231); // Zinc-200
  doc.setLineWidth(0.75);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 24;

  // Body paragraphs
  const bodyFontSize = 11;
  const bodyLineHeight = 17.5;
  const paragraphSpacing = 10;

  const setBodyTypography = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(bodyFontSize);
    doc.setTextColor(31, 41, 55); // Gray-800
  };

  const addContinuationPage = () => {
    doc.addPage();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(113, 113, 122);
    const truncatedTitle =
      documentTitle.length > 72
        ? `${documentTitle.slice(0, 69)}...`
        : documentTitle;
    doc.text(truncatedTitle, marginX, topMargin - 16);
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.5);
    doc.line(marginX, topMargin - 8, pageWidth - marginX, topMargin - 8);
    setBodyTypography();
    cursorY = topMargin + 14;
  };

  setBodyTypography();

  const rawParagraphs = trimmedContent.split(/\r?\n/);

  for (let i = 0; i < rawParagraphs.length; i += 1) {
    const paragraph = rawParagraphs[i].trim();

    if (!paragraph) {
      cursorY += paragraphSpacing;
      if (cursorY > maxBodyY) {
        addContinuationPage();
      }
      continue;
    }

    const wrappedLines = doc.splitTextToSize(paragraph, contentWidth) as string[];

    for (const line of wrappedLines) {
      if (cursorY + bodyLineHeight > maxBodyY) {
        addContinuationPage();
      }
      doc.text(line, marginX, cursorY);
      cursorY += bodyLineHeight;
    }

    if (i < rawParagraphs.length - 1) {
      cursorY += paragraphSpacing * 0.6;
    }
  }

  // Stamp running footer with page numbers on every page
  const totalPages = doc.getNumberOfPages();
  const footerLineY = pageHeight - 40;
  const footerTextY = pageHeight - 26;

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.5);
    doc.line(marginX, footerLineY, pageWidth - marginX, footerLineY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(113, 113, 122);
    doc.text(`BoothScript  ·  Exported ${formalDate}`, marginX, footerTextY);
    doc.text(
      `Page ${page} of ${totalPages}`,
      pageWidth - marginX,
      footerTextY,
      { align: 'right' }
    );
  }

  doc.save(sanitizePdfFilename(documentTitle));
}
