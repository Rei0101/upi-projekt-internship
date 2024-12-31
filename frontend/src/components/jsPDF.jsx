import jsPDF from 'jspdf';

export const exportToPDF = (schedule) => {
  const doc = new jsPDF();
  // Add schedule to the PDF
  doc.text('Schedule', 10, 10);
  schedule.forEach((event, index) => {
    doc.text(`${event.title}: ${event.start} - ${event.end}`, 10, 20 + index * 10);
  });
  doc.save('schedule.pdf');
};

