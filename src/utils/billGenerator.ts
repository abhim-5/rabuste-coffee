import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generateOrderQR, shouldGenerateQR } from './qrGenerator';

export interface BillData {
    orderId: string;
    orderNumber: string;
    orderType: string;
    date: string;
    customerName: string;
    items: {
        name: string;
        quantity: number;
        price: number;
        subtotal: number;
    }[];
    subtotal: number;
    discount?: number;
    total: number;
    paymentMethod: string;
}

type RGBColor = [number, number, number];

export async function generateBillPDF(data: BillData) {
    try {
        console.log('📄 Starting PDF generation for order:', data.orderNumber);
        
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

    // Professional color palette - as tuples
    const brandBrown: RGBColor = [74, 59, 40];
    const accentBrown: RGBColor = [139, 111, 71];
    const lightCream: RGBColor = [250, 245, 237];
    const greenAccent: RGBColor = [34, 197, 94];
    const textDark: RGBColor = [45, 45, 45];
    const white: RGBColor = [255, 255, 255];
    const grayText: RGBColor = [102, 102, 102];
    const redWarning: RGBColor = [200, 0, 0];

    // ==================== HEADER ====================
    doc.setFillColor(brandBrown[0], brandBrown[1], brandBrown[2]);
    doc.rect(0, 0, pageWidth, 60, 'F');

    // Company Name
    doc.setTextColor(white[0], white[1], white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.text('RABUSTE COFFEE', pageWidth / 2, 22, { align: 'center' });

    // Tagline
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.text('Experience the taste of pure Robusta', pageWidth / 2, 32, { align: 'center' });

    // Location
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Surat, Gujarat, India', pageWidth / 2, 40, { align: 'center' });

    // Contact info
    doc.setFontSize(8);
    doc.text('📧 rabustecoffee@gmail.com', pageWidth / 2, 48, { align: 'center' });
    doc.text('Made with ❤️ by Rabuste Team', pageWidth / 2, 55, { align: 'center' });

    // ==================== INVOICE TITLE ====================
    doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
    doc.rect(0, 65, pageWidth, 20, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(brandBrown[0], brandBrown[1], brandBrown[2]);
    doc.text('TAX INVOICE', pageWidth / 2, 77, { align: 'center' });

    // ==================== INVOICE DETAILS BOX ====================
    const detailsY = 90;
    doc.setDrawColor(accentBrown[0], accentBrown[1], accentBrown[2]);
    doc.setLineWidth(0.5);
    doc.setFillColor(white[0], white[1], white[2]);
    doc.roundedRect(15, detailsY, pageWidth - 30, 35, 3, 3, 'FD');

    // Left column
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Invoice No:', 20, detailsY + 8);
    doc.text('Date:', 20, detailsY + 16);
    doc.text('Customer:', 20, detailsY + 24);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(brandBrown[0], brandBrown[1], brandBrown[2]);
    doc.text(data.orderNumber || data.orderId, 50, detailsY + 8);
    doc.text(data.date, 50, detailsY + 16);
    doc.text(data.customerName, 50, detailsY + 24);

    // Right column - Payment status
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Payment:', pageWidth - 70, detailsY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(data.paymentMethod, pageWidth - 35, detailsY + 8, { align: 'right' });

    // PAID badge
    doc.setFillColor(greenAccent[0], greenAccent[1], greenAccent[2]);
    doc.roundedRect(pageWidth - 55, detailsY + 13, 35, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(white[0], white[1], white[2]);
    doc.text('✓ PAID', pageWidth - 37.5, detailsY + 20, { align: 'center' });

    // ==================== ITEMS TABLE ====================
    const tableStartY = detailsY + 45;

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
            fillColor: brandBrown,
            textColor: white,
            fontSize: 11,
            fontStyle: 'bold',
            halign: 'left',
            cellPadding: 5
        },
        bodyStyles: {
            textColor: textDark,
            fontSize: 10,
            cellPadding: 5
        },
        alternateRowStyles: {
            fillColor: lightCream
        },
        columnStyles: {
            0: { cellWidth: 90 },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'right' }
        },
        margin: { left: 15, right: 15 },
        styles: {
            lineColor: accentBrown,
            lineWidth: 0.2
        }
    });

    // ==================== TOTALS SECTION ====================
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const totalsX = pageWidth - 75;

    // Subtotal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text('Subtotal:', totalsX, finalY);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(`₹${data.subtotal.toFixed(2)}`, pageWidth - 20, finalY, { align: 'right' });

    let currentY = finalY + 7;

    // Discount (if applicable)
    if (data.discount && data.discount > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(greenAccent[0], greenAccent[1], greenAccent[2]);
        doc.text('Coupon Discount:', totalsX, currentY);
        doc.text(`-₹${data.discount.toFixed(2)}`, pageWidth - 20, currentY, { align: 'right' });
        currentY += 7;
    }

    // Separator line
    doc.setDrawColor(accentBrown[0], accentBrown[1], accentBrown[2]);
    doc.setLineWidth(0.8);
    doc.line(totalsX - 5, currentY + 2, pageWidth - 15, currentY + 2);

    // Grand Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(brandBrown[0], brandBrown[1], brandBrown[2]);
    doc.text('Grand Total:', totalsX, currentY + 12);
    doc.setTextColor(greenAccent[0], greenAccent[1], greenAccent[2]);
    doc.setFontSize(16);
    doc.text(`₹${data.total.toFixed(2)}`, pageWidth - 20, currentY + 12, { align: 'right' });

    // ==================== QR CODE SECTION (Takeaway Only) ====================
    if (shouldGenerateQR(data.orderType)) {
        try {
            const qrDataURL = await generateOrderQR(data.orderNumber);
            const qrSize = 48;
            const qrX = 20;
            const qrY = currentY + 25;

            // QR Code border/background
            doc.setFillColor(white[0], white[1], white[2]);
            doc.setDrawColor(accentBrown[0], accentBrown[1], accentBrown[2]);
            doc.setLineWidth(0.5);
            doc.roundedRect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6, 2, 2, 'FD');

            // Add QR image
            doc.addImage(qrDataURL, 'PNG', qrX, qrY, qrSize, qrSize);

            // QR Label and instructions
            const labelX = qrX + qrSize + 10;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(brandBrown[0], brandBrown[1], brandBrown[2]);
            doc.text('PICKUP VERIFICATION', labelX, qrY + 6);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(grayText[0], grayText[1], grayText[2]);
            doc.text('Scan this QR at pickup counter', labelX, qrY + 14);
            doc.text(`Order: ${data.orderNumber}`, labelX, qrY + 21);

            doc.setFont('helvetica', 'italic');
            doc.setFontSize(7);
            doc.setTextColor(redWarning[0], redWarning[1], redWarning[2]);
            doc.text('⚠ Do not share this code', labelX, qrY + 28);
        } catch (error) {
            console.error('Failed to add QR code:', error);
        }
    }

    // ==================== FOOTER ====================
    const footerY = pageHeight - 25;
    doc.setDrawColor(accentBrown[0], accentBrown[1], accentBrown[2]);
    doc.setLineWidth(0.3);
    doc.line(20, footerY, pageWidth - 20, footerY);

    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(brandBrown[0], brandBrown[1], brandBrown[2]);
    doc.text('Thank you for your order!', pageWidth / 2, footerY + 8, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text('Visit us again at Rabuste Coffee', pageWidth / 2, footerY + 14, { align: 'center' });

    // Save PDF
    doc.save(`Rabuste-Invoice-${data.orderNumber || data.orderId}.pdf`);
    console.log('✅ PDF saved successfully:', `Rabuste-Invoice-${data.orderNumber || data.orderId}.pdf`);
    
    } catch (error) {
        console.error('❌ PDF Generation Error:', error);
        alert(`Failed to generate PDF: ${(error as Error).message}`);
        throw error;
    }
}
