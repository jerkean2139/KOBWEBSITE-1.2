import { jsPDF } from 'jspdf';

// KeanOnBiz brand colors (OKLCH converted to RGB for jsPDF)
const BRAND = {
  navy: [26, 32, 48] as [number, number, number],         // --background
  navyLight: [34, 42, 62] as [number, number, number],    // --secondary
  surface: [38, 48, 68] as [number, number, number],      // --surface-elevated
  amber: [204, 163, 41] as [number, number, number],      // --amber
  amberDark: [153, 122, 31] as [number, number, number],  // darker amber for text on white
  foreground: [230, 232, 238] as [number, number, number], // --foreground
  textSecondary: [160, 165, 180] as [number, number, number],
  textTertiary: [110, 118, 138] as [number, number, number],
  border: [58, 65, 85] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  red: [220, 60, 60] as [number, number, number],
  green: [50, 180, 100] as [number, number, number],
  yellow: [220, 170, 30] as [number, number, number],
};

function drawPageHeader(doc: jsPDF, title: string) {
  const pw = doc.internal.pageSize.getWidth();
  doc.setFillColor(...BRAND.navy);
  doc.rect(0, 0, pw, 28, 'F');
  // Amber accent line
  doc.setFillColor(...BRAND.amber);
  doc.rect(0, 28, pw, 1.5, 'F');
  doc.setTextColor(...BRAND.white);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pw / 2, 18, { align: 'center' });
}

function drawFooter(doc: jsPDF) {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...BRAND.border);
  doc.setLineWidth(0.3);
  doc.line(20, ph - 18, pw - 20, ph - 18);
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.textTertiary);
  doc.text('KeanOnBiz.com', 20, ph - 12);
  doc.text("The Founder's Filter", pw - 20, ph - 12, { align: 'right' });
}

export function generateFoundersFilterPDF(): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 22;
  const contentWidth = pageWidth - (margin * 2);

  // ── COVER PAGE ──
  doc.setFillColor(...BRAND.navy);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');

  // Amber accent bar at top
  doc.setFillColor(...BRAND.amber);
  doc.rect(0, 0, pageWidth, 3, 'F');

  // ── Title block — compact, top-third of page ──
  doc.setTextColor(...BRAND.amber);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('KEANONBIZ', pageWidth / 2, 28, { align: 'center' });

  doc.setTextColor(...BRAND.foreground);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text("The Founder's Filter", pageWidth / 2, 48, { align: 'center' });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND.textSecondary);
  doc.text('Your Task Delegation Workbook', pageWidth / 2, 60, { align: 'center' });

  doc.setFillColor(...BRAND.amber);
  doc.rect(pageWidth / 2 - 15, 67, 30, 0.8, 'F');

  doc.setTextColor(...BRAND.textTertiary);
  doc.setFontSize(9);
  doc.text('by Jeremy Kean  |  keanonbiz.com', pageWidth / 2, 77, { align: 'center' });

  // ── Explanation — starts earlier, more breathing room ──
  let yPos = 95;
  doc.setTextColor(...BRAND.foreground);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text("What Is The Founder's Filter?", margin, yPos);

  yPos += 9;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND.textSecondary);

  const lines = [
    'As a founder, everything passes through you. Every decision, every task,',
    'every responsibility. But not everything should.',
    '',
    "The Founder's Filter helps you separate what truly requires YOU from",
    'what someone else can — and should — handle.',
    '',
    'You start by dumping everything on your plate. Then you filter each task.',
    "What passes through the filter stays. Everything else flows down to the",
    'people and systems built to handle it.',
  ];
  lines.forEach(line => { doc.text(line, margin, yPos); yPos += 5.2; });

  // ── Three Buckets — generous spacing ──
  yPos += 12;
  doc.setTextColor(...BRAND.amber);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('The Three Buckets', margin, yPos);

  yPos += 12;
  const buckets = [
    { title: '01  Only I Can Do This', desc: 'Strategic decisions, key relationships, vision-setting', color: BRAND.green },
    { title: '02  Delegate Soon', desc: 'Important but trainable — someone else could learn this', color: BRAND.yellow },
    { title: '03  Delegate NOW', desc: "Urgent to offload — you're the bottleneck here", color: BRAND.red },
  ];
  buckets.forEach(b => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...b.color);
    doc.text(b.title, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BRAND.textSecondary);
    doc.setFontSize(9);
    doc.text(b.desc, margin + 2, yPos + 6);
    yPos += 18;
  });

  drawFooter(doc);

  // ── PAGE 2: BRAIN DUMP ──
  doc.addPage();
  doc.setFillColor(...BRAND.navy);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');
  drawPageHeader(doc, 'Step 1: Brain Dump');

  doc.setTextColor(...BRAND.textSecondary);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("List everything you do in a week. Don't filter. Don't judge. Just dump it all out.", margin, 42);

  doc.setDrawColor(...BRAND.border);
  doc.setLineWidth(0.2);
  yPos = 55;
  for (let i = 0; i < 22; i++) {
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 9.5;
  }

  doc.setTextColor(...BRAND.textTertiary);
  doc.setFontSize(8);
  doc.text('Include everything — meetings, emails, tasks, decisions, interruptions, recurring responsibilities.', margin, yPos + 4);
  drawFooter(doc);

  // ── PAGE 3: SORT TASKS ──
  doc.addPage();
  doc.setFillColor(...BRAND.navy);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');
  drawPageHeader(doc, 'Step 2: Sort Your Tasks');

  doc.setTextColor(...BRAND.textSecondary);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Move each task from your brain dump into one of these three columns:', margin, 42);

  const colWidth = (contentWidth - 8) / 3;
  const colStartY = 52;
  const colHeight = doc.internal.pageSize.getHeight() - colStartY - 30;

  const columns = [
    { title: 'Only I Can Do', color: BRAND.green },
    { title: 'Delegate Soon', color: BRAND.yellow },
    { title: 'Delegate NOW', color: BRAND.red },
  ];

  columns.forEach((col, i) => {
    const colX = margin + i * (colWidth + 4);
    // Header
    doc.setFillColor(...col.color);
    doc.rect(colX, colStartY, colWidth, 10, 'F');
    doc.setTextColor(...BRAND.navy);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(col.title, colX + colWidth / 2, colStartY + 7, { align: 'center' });
    // Column box
    doc.setDrawColor(...BRAND.border);
    doc.setLineWidth(0.3);
    doc.rect(colX, colStartY + 10, colWidth, colHeight - 10);
    // Lines inside
    doc.setDrawColor(50, 58, 78);
    for (let lineY = colStartY + 19; lineY < colStartY + colHeight - 5; lineY += 8) {
      doc.line(colX + 3, lineY, colX + colWidth - 3, lineY);
    }
  });
  drawFooter(doc);

  // ── PAGE 4: ACTION PLAN TABLE ──
  doc.addPage();
  doc.setFillColor(...BRAND.navy);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');
  drawPageHeader(doc, 'Step 3: Action Plan');

  doc.setTextColor(...BRAND.textSecondary);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('For each "Delegate NOW" item, create a concrete action plan:', margin, 42);

  const tableHeaders = ['Task', 'Delegate To', 'By When', 'Training Needed?'];
  const colWidths = [55, 40, 35, 40];
  let tableX = margin;
  yPos = 52;

  // Header row
  doc.setFillColor(...BRAND.surface);
  doc.rect(margin, yPos, contentWidth, 9, 'F');
  doc.setTextColor(...BRAND.foreground);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  tableHeaders.forEach((header, i) => {
    doc.text(header, tableX + 2, yPos + 6);
    tableX += colWidths[i];
  });

  yPos += 9;
  doc.setDrawColor(...BRAND.border);
  doc.setLineWidth(0.2);
  for (let row = 0; row < 10; row++) {
    tableX = margin;
    colWidths.forEach(width => {
      doc.rect(tableX, yPos, width, 13);
      tableX += width;
    });
    yPos += 13;
  }

  yPos += 12;
  doc.setTextColor(...BRAND.amber);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Priority Flags', margin, yPos);

  yPos += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND.textSecondary);
  ['[ ]  Affecting my personal life', '[ ]  Blocking business growth', "[ ]  I've been meaning to delegate this for months", '[ ]  Someone else would do this better than me'].forEach(flag => {
    doc.text(flag, margin, yPos);
    yPos += 7;
  });
  drawFooter(doc);

  // ── PAGE 5: FILTER QUESTIONS ──
  doc.addPage();
  doc.setFillColor(...BRAND.navy);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');
  drawPageHeader(doc, "The Founder's Filter Questions");

  doc.setTextColor(...BRAND.textSecondary);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Use these questions to evaluate each task on your list:', margin, 42);

  const questions = [
    'Does this task require my specific expertise or relationships?',
    'Would the business survive if someone else did this?',
    'Could I train someone to do this in less than a week?',
    "Am I holding onto this because I enjoy it, or because it's necessary?",
    "What's the cost of me continuing to do this myself?",
    'If I got hit by a bus tomorrow, could someone pick this up?',
    'Is this a $20/hour task or a $200/hour task?',
  ];

  yPos = 55;
  questions.forEach((q, i) => {
    doc.setTextColor(...BRAND.amber);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`${String(i + 1).padStart(2, '0')}`, margin, yPos);
    doc.setTextColor(...BRAND.foreground);
    doc.text(q, margin + 10, yPos);
    doc.setDrawColor(...BRAND.border);
    for (let l = 0; l < 2; l++) {
      yPos += 7;
      doc.line(margin + 10, yPos, pageWidth - margin, yPos);
    }
    yPos += 10;
  });
  drawFooter(doc);

  // ── PAGE 6: 30-DAY COMMITMENT ──
  doc.addPage();
  doc.setFillColor(...BRAND.navy);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');
  drawPageHeader(doc, 'Your 30-Day Delegation Commitment');

  doc.setTextColor(...BRAND.textSecondary);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPos = 45;
  doc.text('I commit to delegating these three tasks in the next 30 days:', margin, yPos);

  yPos += 12;
  for (let i = 1; i <= 3; i++) {
    doc.setTextColor(...BRAND.amber);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`Task ${i}`, margin, yPos);
    doc.setDrawColor(...BRAND.border);
    doc.line(margin + 18, yPos, pageWidth - margin, yPos);
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.textTertiary);
    ['Who will own this:', 'Training plan:', 'Handoff date:'].forEach(label => {
      doc.text(label, margin + 4, yPos);
      doc.line(margin + 38, yPos, pageWidth - margin, yPos);
      yPos += 9;
    });
    yPos += 8;
  }

  yPos += 8;
  doc.setTextColor(...BRAND.foreground);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Signature:', margin, yPos);
  doc.setDrawColor(...BRAND.amber);
  doc.line(margin + 28, yPos, margin + 100, yPos);
  doc.text('Date:', margin + 110, yPos);
  doc.line(margin + 125, yPos, pageWidth - margin, yPos);

  yPos += 20;
  doc.setFillColor(...BRAND.surface);
  doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'F');
  doc.setTextColor(...BRAND.amber);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Ready for the Next Step?', margin + 8, yPos + 12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND.textSecondary);
  doc.setFontSize(9);
  doc.text('Book a free discovery call with Jeremy at keanonbiz.com/jeremys-calendar-intro', margin + 8, yPos + 22);
  doc.text('Take the free Mini Audit at keanonbiz.com/assessment', margin + 8, yPos + 30);

  drawFooter(doc);
  doc.save('Founders-Filter-Workbook.pdf');
}

export default function FoundersFilterPDFDownloadButton({ className }: { className?: string }) {
  return (
    <button onClick={() => generateFoundersFilterPDF()} className={className}>
      Download Your Workbook (PDF)
    </button>
  );
}
