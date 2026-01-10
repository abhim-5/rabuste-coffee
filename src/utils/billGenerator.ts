import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface BillData {
    orderId: string;
    date: string;
    customerName: string;
    items: {
        name: string;
        quantity: number;
        price: number;
        subtotal: number;
    }[];
    subtotal: number;
    total: number;
    paymentMethod: string;
}

export function generateBillPDF(data: BillData) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors
    const primaryColor = '#4A3B28'; // Dark Brown
    const secondaryColor = '#8B6F47'; // Medium Brown
    const accentColor = '#D8CBB8'; // Light Beige
    const textDark = '#2D2D2D';
    const textLight = '#666666';

    // Header Background
    doc.setFillColor(74, 59, 40); // primaryColor
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Company Logo/Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('RABUSTE COFFEE', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Experience the taste of pure Robusta', pageWidth / 2, 28, { align: 'center' });
    doc.text('Surat, Gujarat, India', pageWidth / 2, 35, { align: 'center' });

    // Decorative Line
    doc.setDrawColor(216, 203, 184); // accentColor
    doc.setLineWidth(0.5);
    doc.line(20, 42, pageWidth - 20, 42);

    // Invoice Title
    doc.setTextColor(74, 59, 40);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', 20, 60);

    // Invoice Details Box
    doc.setDrawColor(139, 111, 71); // secondaryColor
    doc.setFillColor(249, 245, 241); // Very light beige
    doc.roundedRect(20, 68, pageWidth - 40, 30, 2, 2, 'FD');

    // Invoice Details - Left Side
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(74, 59, 40);
    doc.text('Invoice No:', 25, 77);
    doc.text('Date:', 25, 84);
    doc.text('Customer:', 25, 91);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 45, 45);
    doc.text(data.orderId, 52, 77);
    doc.text(data.date, 52, 84);
    doc.text(data.customerName, 52, 91);

    // Payment Status - Right Side
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(74, 59, 40);
    doc.text('Payment:', pageWidth - 80, 77);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 45, 45);
    doc.text(data.paymentMethod, pageWidth - 45, 77);

    doc.setFont('helvetica', 'bold');
    doc.setFillColor(34, 197, 94); // Green
    doc.roundedRect(pageWidth - 55, 82, 30, 8, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('PAID', pageWidth - 40, 87.5, { align: 'center' });

    // Items Table
    const tableStartY = 110;
    
    autoTable(doc, {
        startY: tableStartY,
        head: [['Item', 'Qty', 'Price', 'Amount']],
        body: data.items.map(item => [
            item.name,
            item.quantity.toString(),
            `₹${item.price.toFixed(2)}`,
            `₹${item.subtotal.toFixed(2)}`
        ]),
        theme: 'grid',
        headStyles: {
            fillColor: [74, 59, 40], // primaryColor
            textColor: [255, 255, 255],
            fontSize: 11,
            fontStyle: 'bold',
            halign: 'left'
        },
        bodyStyles: {
            textColor: [45, 45, 45],
            fontSize: 10,
            cellPadding: 6
        },
        alternateRowStyles: {
            fillColor: [249, 245, 241] // Very light beige
        },
        columnStyles: {
            0: { cellWidth: 80 }, // Item name
            1: { cellWidth: 25, halign: 'center' }, // Qty
            2: { cellWidth: 35, halign: 'right' }, // Price
            3: { cellWidth: 40, halign: 'right' } // Amount
        },
        margin: { left: 20, right: 20 },
        styles: {
            lineColor: [139, 111, 71],
            lineWidth: 0.1
        }
    });

    // Get the Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Totals Section
    const totalsX = pageWidth - 90;
    const totalsStartY = finalY;

    // Subtotal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(102, 102, 102);
    doc.text('Subtotal:', totalsX, totalsStartY);
    doc.setTextColor(45, 45, 45);
    doc.text(`₹${data.subtotal.toFixed(2)}`, pageWidth - 25, totalsStartY, { align: 'right' });

    // Decorative line above grand total
    doc.setDrawColor(139, 111, 71);
    doc.setLineWidth(0.5);
    doc.line(totalsX - 5, totalsStartY + 5, pageWidth - 20, totalsStartY + 5);

    // Grand Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(74, 59, 40);
    doc.text('Grand Total:', totalsX, totalsStartY + 15);
    doc.setTextColor(34, 197, 94); // Green
    doc.text(`₹${data.total.toFixed(2)}`, pageWidth - 25, totalsStartY + 15, { align: 'right' });

    // Footer
    const footerY = pageHeight - 30;
    doc.setDrawColor(216, 203, 184);
    doc.setLineWidth(0.3);
    doc.line(20, footerY, pageWidth - 20, footerY);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(102, 102, 102);
    doc.text('Thank you for your order!', pageWidth / 2, footerY + 8, { align: 'center' });
    doc.text('Visit us again at Rabuste Coffee', pageWidth / 2, footerY + 14, { align: 'center' });

    // Watermark
    doc.setFontSize(60);
    doc.setTextColor(220, 220, 220);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID', pageWidth / 2, pageHeight / 2, {
        align: 'center',
        angle: 45,
        renderingMode: 'stroke'
    });

    // Save PDF
    doc.save(`Rabuste-Invoice-${data.orderId}.pdf`);
}
