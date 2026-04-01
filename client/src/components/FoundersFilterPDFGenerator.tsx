import { jsPDF } from 'jspdf';

export function generateFoundersFilterPDF(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  const primaryColor: [number, number, number] = [37, 99, 235];
  const darkColor: [number, number, number] = [30, 41, 59];
  const grayColor: [number, number, number] = [100, 116, 139];

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 80, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text("The Founder's Filter", pageWidth / 2, 35, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Task Delegation Workbook', pageWidth / 2, 50, { align: 'center' });

  doc.setFontSize(12);
  doc.text('by Jeremy Kean | KeanOnBiz.com', pageWidth / 2, 65, { align: 'center' });

  doc.setTextColor(...darkColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text("What Is The Founder's Filter?", margin, 100);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);

  const filterExplanation = [
    'As a founder, everything passes through you. Every decision, every task,',
    'every responsibility. But not everything should.',
    '',
    'The Founder\'s Filter helps you separate what truly requires YOU from',
    'what someone else can — and should — handle.',
    '',
    'You start by dumping everything on your plate. Then you filter each task:',
    'Does this require my unique expertise? Can someone be trained to do this?',
    'Or should this have been delegated months ago?',
    '',
    'What passes through the filter stays on your plate.',
    'Everything else flows down to the people and systems built to handle it.',
    '',
    'When the people below you are at capacity with properly filtered work?',
    'That\'s your signal. Time to hire. Time to expand the team.'
  ];

  let yPos = 110;
  filterExplanation.forEach(line => {
    doc.text(line, margin, yPos);
    yPos += 6;
  });

  doc.setTextColor(...darkColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('The Three Buckets', margin, yPos + 15);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);

  const buckets = [
    { title: '1. Only I Can Do This', desc: 'Strategic decisions, key relationships, vision-setting' },
    { title: '2. Delegate Soon', desc: 'Important but trainable—someone else could learn this' },
    { title: '3. Delegate NOW', desc: 'Urgent to offload—you\'re the bottleneck here' }
  ];

  yPos += 25;
  buckets.forEach(bucket => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(bucket.title, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text(bucket.desc, margin, yPos + 6);
    yPos += 18;
  });

  doc.addPage();

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Step 1: Brain Dump', pageWidth / 2, 17, { align: 'center' });

  doc.setTextColor(...grayColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('List everything you do in a week. Don\'t filter. Don\'t judge. Just dump it all out.', margin, 40);

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);

  yPos = 55;
  const lineSpacing = 10;
  const numLines = 20;

  for (let i = 0; i < numLines; i++) {
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += lineSpacing;
  }

  doc.setTextColor(...grayColor);
  doc.setFontSize(9);
  doc.text('Tip: Include everything—meetings, emails, tasks, decisions, interruptions, recurring responsibilities.', margin, yPos + 5);

  doc.addPage();

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Step 2: Sort Your Tasks', pageWidth / 2, 17, { align: 'center' });

  doc.setTextColor(...grayColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Move each task from your brain dump into one of these three columns:', margin, 38);

  const colWidth = (contentWidth - 10) / 3;
  const colStartY = 50;
  const colHeight = pageHeight - colStartY - 30;

  const columns = [
    { title: 'Only I Can Do', color: [34, 197, 94] as [number, number, number] },
    { title: 'Delegate Soon', color: [234, 179, 8] as [number, number, number] },
    { title: 'Delegate NOW', color: [239, 68, 68] as [number, number, number] }
  ];

  columns.forEach((col, i) => {
    const colX = margin + (i * (colWidth + 5));

    doc.setFillColor(...col.color);
    doc.rect(colX, colStartY, colWidth, 12, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(col.title, colX + colWidth / 2, colStartY + 8, { align: 'center' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(colX, colStartY + 12, colWidth, colHeight - 12);

    doc.setDrawColor(230, 230, 230);
    for (let lineY = colStartY + 22; lineY < colStartY + colHeight - 5; lineY += 8) {
      doc.line(colX + 3, lineY, colX + colWidth - 3, lineY);
    }
  });

  doc.addPage();

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Step 3: Action Plan', pageWidth / 2, 17, { align: 'center' });

  doc.setTextColor(...grayColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('For each "Delegate NOW" item, create a concrete action plan:', margin, 40);

  const tableHeaders = ['Task', 'Delegate To', 'By When', 'Training Needed?'];
  const colWidths = [55, 40, 35, 40];
  let tableX = margin;
  yPos = 50;

  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos, contentWidth, 10, 'F');

  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');

  tableHeaders.forEach((header, i) => {
    doc.text(header, tableX + 2, yPos + 7);
    tableX += colWidths[i];
  });

  yPos += 10;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);

  for (let row = 0; row < 10; row++) {
    tableX = margin;
    colWidths.forEach(width => {
      doc.rect(tableX, yPos, width, 15);
      tableX += width;
    });
    yPos += 15;
  }

  yPos += 15;
  doc.setTextColor(...darkColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Priority Flags', margin, yPos);

  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);

  const flags = [
    '[ ] This is affecting my personal life (Priority Flag)',
    '[ ] This is blocking business growth (Operations Flag)',
    '[ ] I\'ve been meaning to delegate this for months (Overdue Flag)',
    '[ ] Someone else would do this better than me (Skill Mismatch Flag)'
  ];

  flags.forEach(flag => {
    doc.text(flag, margin, yPos);
    yPos += 8;
  });

  doc.addPage();

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text("The Founder's Filter Questions", pageWidth / 2, 17, { align: 'center' });

  doc.setTextColor(...grayColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Use these questions to evaluate each task on your list:', margin, 40);

  const questions = [
    { q: '1. Does this task require my specific expertise or relationships?', space: 3 },
    { q: '2. Would the business survive if someone else did this?', space: 3 },
    { q: '3. Could I train someone to do this in less than a week?', space: 3 },
    { q: '4. Am I holding onto this because I enjoy it, or because it\'s necessary?', space: 3 },
    { q: '5. What\'s the cost of me continuing to do this myself?', space: 3 },
    { q: '6. If I got hit by a bus tomorrow, could someone pick this up?', space: 3 },
    { q: '7. Is this a $20/hour task or a $200/hour task?', space: 3 }
  ];

  yPos = 55;
  questions.forEach(item => {
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text(item.q, margin, yPos);

    doc.setDrawColor(200, 200, 200);
    for (let i = 0; i < item.space; i++) {
      yPos += 8;
      doc.line(margin, yPos, pageWidth - margin, yPos);
    }
    yPos += 12;
  });

  doc.addPage();

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Your 30-Day Delegation Commitment', pageWidth / 2, 17, { align: 'center' });

  doc.setTextColor(...grayColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  yPos = 45;
  doc.text('I commit to delegating these three tasks in the next 30 days:', margin, yPos);

  yPos += 15;
  for (let i = 1; i <= 3; i++) {
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`Task ${i}:`, margin, yPos);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin + 20, yPos, pageWidth - margin, yPos);
    yPos += 12;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text('Who will own this:', margin, yPos);
    doc.line(margin + 45, yPos, pageWidth - margin, yPos);
    yPos += 12;

    doc.text('Training plan:', margin, yPos);
    doc.line(margin + 35, yPos, pageWidth - margin, yPos);
    yPos += 12;

    doc.text('Handoff date:', margin, yPos);
    doc.line(margin + 35, yPos, pageWidth - margin, yPos);
    yPos += 20;
  }

  yPos += 10;
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text('My Signature:', margin, yPos);
  doc.setDrawColor(100, 100, 100);
  doc.line(margin + 40, yPos, margin + 120, yPos);

  doc.text('Date:', margin + 130, yPos);
  doc.line(margin + 145, yPos, pageWidth - margin, yPos);

  yPos += 25;
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPos, contentWidth, 40, 'F');

  doc.setTextColor(...darkColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Need Help?', margin + 5, yPos + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.setFontSize(10);
  doc.text('Book a free strategy call with Jeremy at keanonbiz.com/jeremys-calendar', margin + 5, yPos + 24);
  doc.text("Try The Founder's Filter at keanonbiz.com/founders-filter", margin + 5, yPos + 34);

  doc.save('Founders-Filter-Workbook.pdf');
}

export default function FoundersFilterPDFDownloadButton({ className }: { className?: string }) {
  const handleDownload = () => {
    generateFoundersFilterPDF();
  };

  return (
    <button
      onClick={handleDownload}
      className={className}
    >
      Download Your Workbook (PDF)
    </button>
  );
}
