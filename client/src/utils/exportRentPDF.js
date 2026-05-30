import jsPDF from 'jspdf';

function getTodayDate() {
  const d = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()}-${months[d.getMonth()]}-${d.getFullYear()}`;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function generateRentPDF({ roomNumber, tenantName, rentAmount, year, payments }) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('UM Cottage', 20, y);
  y += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Rent Details', 20, y);
  y += 12;

  // Room info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Room ${roomNumber}`, 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tenant: ${tenantName}`, 60, y);
  doc.text(`Monthly Rent: Rs.${rentAmount.toLocaleString()}`, 130, y);
  y += 6;
  doc.text(`Year: ${year}`, 20, y);
  y += 10;

  // Divider
  doc.setDrawColor(200);
  doc.line(20, y, pageWidth - 20, y);
  y += 8;

  // Table header
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(240, 240, 240);
  doc.rect(20, y - 4, pageWidth - 40, 8, 'F');
  doc.text('Month', 22, y);
  doc.text('Date Paid', 65, y);
  doc.text('Amount Paid', 105, y);
  doc.text('Status', 155, y);
  y += 8;

  // Group payments by month
  const paymentsByMonth = {};
  payments.forEach((p) => {
    if (!paymentsByMonth[p.month]) paymentsByMonth[p.month] = [];
    paymentsByMonth[p.month].push(p);
  });

  // Table rows
  doc.setFont('helvetica', 'normal');
  let totalPaid = 0;

  MONTHS.forEach((month, idx) => {
    const entries = paymentsByMonth[month] || [];
    const monthTotal = entries.reduce((sum, p) => sum + p.amountPaid, 0);
    totalPaid += monthTotal;

    let status;
    if (entries.length === 0 || monthTotal <= 0) status = 'Pending';
    else if (monthTotal >= rentAmount) status = 'Paid';
    else status = 'Partial';

    // Check if we need a new page
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    // Row background
    if (idx % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, y - 4, pageWidth - 40, 7, 'F');
    }

    doc.setFontSize(8);
    doc.text(month, 22, y);

    if (entries.length > 0) {
      entries.forEach((entry, eIdx) => {
        if (eIdx > 0) {
          y += 5;
          if (y > 260) {
            doc.addPage();
            y = 20;
          }
        }
        const dateStr = entry.datePaid
          ? new Date(entry.datePaid).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
          : '-';
        doc.text(dateStr, 65, y);
        doc.text(`Rs.${entry.amountPaid.toLocaleString()}`, 105, y);
        if (eIdx === 0) {
          doc.text(status, 155, y);
        }
      });
    } else {
      doc.text('-', 65, y);
      doc.text('Rs.0', 105, y);
      doc.setTextColor(150);
      doc.text('Pending', 155, y);
      doc.setTextColor(0);
    }

    y += 7;
  });

  // Summary
  y += 5;
  if (y > 250) {
    doc.addPage();
    y = 20;
  }

  doc.setDrawColor(200);
  doc.line(20, y, pageWidth - 20, y);
  y += 8;

  const totalDue = rentAmount * 12;
  const remaining = totalDue - totalPaid;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 22, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.text(`Total Due: Rs.${totalDue.toLocaleString()}`, 22, y);
  doc.text(`Total Paid: Rs.${totalPaid.toLocaleString()}`, 80, y);
  doc.text(`Remaining: Rs.${remaining.toLocaleString()}`, 140, y);

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 20, pageHeight - 10);
  doc.text('UM Cottage Property Management', pageWidth - 20, pageHeight - 10, { align: 'right' });

  return doc;
}

export async function generateAllRoomsPDF({ tenants, year, fetchPayments }) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const sorted = [...tenants]
    .filter((t) => t.room)
    .sort((a, b) => (a.room?.roomNumber || 0) - (b.room?.roomNumber || 0));

  // Cover page
  let y = 60;
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('UM Cottage', pageWidth / 2, y, { align: 'center' });
  y += 12;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Rent Details — All Rooms', pageWidth / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(11);
  doc.text(`Year: ${year}`, pageWidth / 2, y, { align: 'center' });
  y += 8;
  doc.text(`Total Rooms: ${sorted.length}`, pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, y, { align: 'center' });

  // Process each room
  for (const tenant of sorted) {
    doc.addPage();
    y = 20;

    // Fetch payments for this tenant
    let payments = [];
    try {
      payments = await fetchPayments(tenant._id, year);
    } catch (e) {
      payments = [];
    }

    const rentAmount = tenant.room?.rentAmount || 0;

    // Room header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Room ${tenant.room.roomNumber}`, 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tenant: ${tenant.name}`, 20, y);
    doc.text(`Monthly Rent: Rs.${rentAmount.toLocaleString()}`, 120, y);
    y += 6;
    doc.text(`Year: ${year}`, 20, y);
    y += 10;

    // Divider
    doc.setDrawColor(200);
    doc.line(20, y, pageWidth - 20, y);
    y += 8;

    // Table header
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 4, pageWidth - 40, 8, 'F');
    doc.text('Month', 22, y);
    doc.text('Date Paid', 65, y);
    doc.text('Amount Paid', 105, y);
    doc.text('Status', 155, y);
    y += 8;

    // Group payments by month
    const paymentsByMonth = {};
    payments.forEach((p) => {
      if (!paymentsByMonth[p.month]) paymentsByMonth[p.month] = [];
      paymentsByMonth[p.month].push(p);
    });

    doc.setFont('helvetica', 'normal');
    let totalPaid = 0;

    MONTHS.forEach((month, idx) => {
      const entries = paymentsByMonth[month] || [];
      const monthTotal = entries.reduce((sum, p) => sum + p.amountPaid, 0);
      totalPaid += monthTotal;

      let status;
      if (entries.length === 0 || monthTotal <= 0) status = 'Pending';
      else if (monthTotal >= rentAmount) status = 'Paid';
      else status = 'Partial';

      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      if (idx % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(20, y - 4, pageWidth - 40, 7, 'F');
      }

      doc.setFontSize(8);
      doc.text(month, 22, y);

      if (entries.length > 0) {
        entries.forEach((entry, eIdx) => {
          if (eIdx > 0) {
            y += 5;
            if (y > 260) {
              doc.addPage();
              y = 20;
            }
          }
          const dateStr = entry.datePaid
            ? new Date(entry.datePaid).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
            : '-';
          doc.text(dateStr, 65, y);
          doc.text(`Rs.${entry.amountPaid.toLocaleString()}`, 105, y);
          if (eIdx === 0) doc.text(status, 155, y);
        });
      } else {
        doc.text('-', 65, y);
        doc.text('Rs.0', 105, y);
        doc.setTextColor(150);
        doc.text('Pending', 155, y);
        doc.setTextColor(0);
      }

      y += 7;
    });

    // Summary
    y += 5;
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setDrawColor(200);
    doc.line(20, y, pageWidth - 20, y);
    y += 8;

    const totalDue = rentAmount * 12;
    const remaining = totalDue - totalPaid;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 22, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.text(`Total Due: Rs.${totalDue.toLocaleString()}`, 22, y);
    doc.text(`Total Paid: Rs.${totalPaid.toLocaleString()}`, 80, y);
    doc.text(`Remaining: Rs.${remaining.toLocaleString()}`, 140, y);

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(`Room ${tenant.room.roomNumber} — ${tenant.name}`, 20, pageHeight - 10);
    doc.text('UM Cottage Property Management', pageWidth - 20, pageHeight - 10, { align: 'right' });
    doc.setTextColor(0);
  }

  return doc;
}

export function exportAllRoomsPDF(roomsData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Cover page
  let y = 60;
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('UM Cottage', pageWidth / 2, y, { align: 'center' });
  y += 12;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Rent Details — All Rooms', pageWidth / 2, y, { align: 'center' });
  y += 10;

  const year = roomsData.length > 0 ? roomsData[0].year : new Date().getFullYear();
  doc.setFontSize(11);
  doc.text(`Year: ${year}`, pageWidth / 2, y, { align: 'center' });
  y += 8;
  doc.text(`Total Rooms: ${roomsData.length}`, pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, y, { align: 'center' });

  roomsData.sort((a, b) => a.roomNumber - b.roomNumber);

  for (const room of roomsData) {
    doc.addPage();
    y = 20;

    const { roomNumber, tenantName, rentAmount, payments } = room;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Room ${roomNumber}`, 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tenant: ${tenantName}`, 20, y);
    doc.text(`Monthly Rent: Rs.${rentAmount.toLocaleString()}`, 120, y);
    y += 6;
    doc.text(`Year: ${year}`, 20, y);
    y += 10;

    doc.setDrawColor(200);
    doc.line(20, y, pageWidth - 20, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 4, pageWidth - 40, 8, 'F');
    doc.text('Month', 22, y);
    doc.text('Date Paid', 65, y);
    doc.text('Amount Paid', 105, y);
    doc.text('Status', 155, y);
    y += 8;

    const paymentsByMonth = {};
    (payments || []).forEach((p) => {
      if (!paymentsByMonth[p.month]) paymentsByMonth[p.month] = [];
      paymentsByMonth[p.month].push(p);
    });

    doc.setFont('helvetica', 'normal');
    let totalPaid = 0;

    MONTHS.forEach((month, idx) => {
      const entries = paymentsByMonth[month] || [];
      const monthTotal = entries.reduce((sum, p) => sum + p.amountPaid, 0);
      totalPaid += monthTotal;

      let status;
      if (entries.length === 0 || monthTotal <= 0) status = 'Pending';
      else if (monthTotal >= rentAmount) status = 'Paid';
      else status = 'Partial';

      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      if (idx % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(20, y - 4, pageWidth - 40, 7, 'F');
      }

      doc.setFontSize(8);
      doc.text(month, 22, y);

      if (entries.length > 0) {
        entries.forEach((entry, eIdx) => {
          if (eIdx > 0) {
            y += 5;
            if (y > 260) {
              doc.addPage();
              y = 20;
            }
          }
          const dateStr = entry.datePaid
            ? new Date(entry.datePaid).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
            : '-';
          doc.text(dateStr, 65, y);
          doc.text(`Rs.${entry.amountPaid.toLocaleString()}`, 105, y);
          if (eIdx === 0) doc.text(status, 155, y);
        });
      } else {
        doc.text('-', 65, y);
        doc.text('Rs.0', 105, y);
        doc.setTextColor(150);
        doc.text('Pending', 155, y);
        doc.setTextColor(0);
      }

      y += 7;
    });

    y += 5;
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setDrawColor(200);
    doc.line(20, y, pageWidth - 20, y);
    y += 8;

    const totalDue = rentAmount * 12;
    const remaining = totalDue - totalPaid;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 22, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.text(`Total Due: Rs.${totalDue.toLocaleString()}`, 22, y);
    doc.text(`Total Paid: Rs.${totalPaid.toLocaleString()}`, 80, y);
    doc.text(`Remaining: Rs.${remaining.toLocaleString()}`, 140, y);

    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(`Room ${roomNumber} — ${tenantName}`, 20, pageHeight - 10);
    doc.text('UM Cottage Property Management', pageWidth - 20, pageHeight - 10, { align: 'right' });
    doc.setTextColor(0);
  }

  doc.save(`UM_Cottage_All_Rooms_${year}_${getTodayDate()}.pdf`);
}

export function exportSingleRoomPDF({ roomNumber, tenantName, rentAmount, year, payments }) {
  const doc = generateRentPDF({ roomNumber, tenantName, rentAmount, year, payments });
  doc.save(`Room_${roomNumber || 'NA'}_Rent_${getTodayDate()}.pdf`);
}
