import QRCode from 'qrcode';

/**
 * Generate QR code as Data URL (base64 PNG) for display in browser
 * @param orderNumber - The order number to encode (e.g., RC123456)
 * @param siteUrl - Base URL of the application (e.g., https://rabustecoffee.vercel.app)
 * @returns Promise<string> - Data URL of the QR code image
 */
export async function generateOrderQR(
    orderNumber: string,
    siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
): Promise<string> {
    const verificationUrl = `${siteUrl}/admin/verify-order?code=${orderNumber}`;
    
    try {
        const qrDataURL = await QRCode.toDataURL(verificationUrl, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            width: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        return qrDataURL;
    } catch (error) {
        console.error('QR generation error:', error);
        throw new Error('Failed to generate QR code');
    }
}

/**
 * Generate QR code as buffer for PDF embedding
 * @param orderNumber - The order number to encode
 * @param siteUrl - Base URL of the application
 * @returns Promise<Buffer> - QR code as buffer
 */
export async function generateOrderQRBuffer(
    orderNumber: string,
    siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
): Promise<Buffer> {
    const verificationUrl = `${siteUrl}/admin/verify-order?code=${orderNumber}`;
    
    try {
        const qrBuffer = await QRCode.toBuffer(verificationUrl, {
            errorCorrectionLevel: 'M',
            width: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        return qrBuffer;
    } catch (error) {
        console.error('QR buffer generation error:', error);
        throw new Error('Failed to generate QR code buffer');
    }
}

/**
 * Check if order type requires QR verification
 * @param orderType - Type of order ('dine-in', 'takeaway-now', 'takeaway-scheduled')
 * @returns boolean - True if QR should be generated
 */
export function shouldGenerateQR(orderType: string): boolean {
    return orderType === 'takeaway-now' || orderType === 'takeaway-scheduled';
}
