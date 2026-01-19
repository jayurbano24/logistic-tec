
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JsBarcode from 'jsbarcode';

// Utilidad para generar imagen PNG del código de barras
async function generarBarcodePNG(texto: string) {
    // Check if we are in a browser environment
    if (typeof window === 'undefined') return '';
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, texto, { format: 'CODE128', width: 2, height: 60, displayValue: false });
    return canvas.toDataURL('image/png');
}

// Generador de PDF para Manifiesto de Carga
export async function generarPDFManifiesto(solicitud: any) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([900, 650]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const rojo = rgb(0.91, 0.30, 0.24);
    const negro = rgb(0, 0, 0);

    // Border exterior
    page.drawRectangle({ x: 0, y: 0, width: 900, height: 650, borderColor: negro, borderWidth: 1 });

    // HEADER
    // Texto logo
    page.drawText('cargo', { x: 100, y: 620, size: 16, font: fontBold, color: negro });
    page.drawText('expreso', { x: 100, y: 605, size: 16, font: fontBold, color: rojo });
    // Título central
    page.drawText('Manifiesto de Carga', { x: 350, y: 620, size: 18, font: fontBold, color: negro });
    page.drawLine({ start: { x: 350, y: 618 }, end: { x: 540, y: 618 }, color: negro, thickness: 1 });
    // Fechas y código crédito
    const today = new Date().toLocaleDateString('es-GT');
    page.drawText(`Fecha: ${today}`, { x: 350, y: 600, size: 11, font, color: negro });
    page.drawText('Código Crédito: - Todos -', { x: 350, y: 585, size: 11, font, color: negro });
    page.drawText('Servicio:', { x: 520, y: 585, size: 11, font, color: negro });

    // TABLA DE DATOS - Encabezados
    const headers = [
        'No. Guía / Crédito', 'Destinatario', 'Org', 'Dst', 'Remitente', 'Contado', 'COD/Collect', 'Servicio', 'Referencias'
    ];
    let xCols = [20, 160, 350, 390, 430, 630, 680, 780, 830];
    let y = 560;
    headers.forEach((h, i) => {
        page.drawText(h, { x: xCols[i], y, size: 10, font: fontBold, color: negro });
    });
    page.drawLine({ start: { x: 20, y: y - 2 }, end: { x: 880, y: y - 2 }, color: negro, thickness: 1 });

    // Fila de datos
    y -= 22;
    page.drawText((solicitud.guia_caex_referencia || '1W260566282'), { x: xCols[0], y, size: 9, font, color: negro });
    const dest = solicitud.info_entrega?.nombreEntrega || solicitud.destinatario || '';
    page.drawText(dest.substring(0, 35), { x: xCols[1], y, size: 9, font, color: negro });
    page.drawText((solicitud.origen || 'CAP'), { x: xCols[2], y, size: 9, font, color: negro });
    page.drawText((solicitud.destino || 'ESC'), { x: xCols[3], y, size: 9, font, color: negro });
    const rem = solicitud.remitente || 'TECHNICOMM WIRELESS';
    page.drawText(rem.substring(0, 35), { x: xCols[4], y, size: 9, font, color: negro });
    page.drawText('No', { x: xCols[5], y, size: 9, font, color: negro });
    page.drawText((solicitud.tipo_servicio || 'SE'), { x: xCols[7], y, size: 9, font, color: negro });
    const ref = solicitud.ticket_life_one || solicitud.referencia1 || '';
    page.drawText(ref, { x: xCols[8], y, size: 9, font, color: negro });

    // Detalles de pieza
    y -= 30;
    page.drawRectangle({ x: 20, y: y, width: 12, height: 12, borderColor: negro, borderWidth: 1 });
    page.drawText('1 de 1', { x: 40, y: y + 2, size: 9, font, color: negro });
    page.drawText((solicitud.guia_caex_referencia || '1W260566282'), { x: 100, y: y + 2, size: 9, font, color: negro });
    page.drawText((solicitud.guia_caex_referencia || '1W260566282'), { x: 180, y: y + 2, size: 9, font, color: negro });
    page.drawText((solicitud.peso || '5.00'), { x: 260, y: y + 2, size: 9, font, color: negro });
    page.drawText((solicitud.tipo_producto || 'ACCESORIO'), { x: 340, y: y + 2, size: 9, font, color: negro });

    // TOTALES
    page.drawText('Guías Estandar = 1', { x: 40, y: 60, size: 11, font, color: negro });
    page.drawText('Guías COD = 0', { x: 200, y: 60, size: 11, font, color: negro });
    page.drawText('Guías Collect = 0', { x: 400, y: 60, size: 11, font, color: negro });
    page.drawText('Guías Especiales = 0', { x: 600, y: 60, size: 11, font, color: negro });
    page.drawText('Total COD =', { x: 300, y: 40, size: 11, font, color: negro });
    page.drawText('Total Collect =', { x: 500, y: 40, size: 11, font, color: negro });

    // Descargar PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Manifiesto_${solicitud.guia_caex_referencia || 'manifiesto'}.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}

// Generador de PDF profesional con layout y código de barras
export async function generarPDFGuia(solicitud: any) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([800, 1100]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const azul = rgb(0, 0.24, 0.42);
    const rojo = rgb(0.83, 0.18, 0.18);
    const negro = rgb(0, 0, 0);

    // Border exterior
    page.drawRectangle({ x: 0, y: 0, width: 800, height: 1100, borderColor: negro, borderWidth: 3 });

    // HEADER
    page.drawLine({ start: { x: 35, y: 1085 }, end: { x: 60, y: 1085 }, color: rojo, thickness: 8 });
    page.drawLine({ start: { x: 60, y: 1095 }, end: { x: 60, y: 1075 }, color: rojo, thickness: 8 });
    page.drawText('cargo', { x: 75, y: 1072, size: 14, font: fontBold, color: negro });
    page.drawText('expreso', { x: 75, y: 1058, size: 12, font: fontBold, color: rojo });
    page.drawText('PBX 1776   WA 2474-4444', { x: 600, y: 1082, size: 10, font, color: negro });
    page.drawText('1/1', { x: 730, y: 1065, size: 16, font: fontBold, color: negro });
    page.drawLine({ start: { x: 0, y: 1050 }, end: { x: 800, y: 1050 }, color: negro, thickness: 1 });

    // NÚMERO DE GUÍA Y SE
    page.drawRectangle({ x: 0, y: 1010, width: 600, height: 40, color: azul });
    page.drawText((solicitud.guia_caex_referencia || ''), { x: 30, y: 1020, size: 22, font: fontBold, color: rgb(1, 1, 1) });

    const boxX = 610;
    const boxY = 1010;
    const boxW = 170;
    const boxH = 40;
    page.drawRectangle({ x: boxX, y: boxY, width: boxW, height: boxH, borderColor: negro, borderWidth: 3 });

    const seText = solicitud.tipo_servicio || 'SE';
    const seFontSize = 36;
    const seTextWidth = fontBold.widthOfTextAtSize(seText, seFontSize);
    const seTextHeight = seFontSize;
    const seX = boxX + (boxW - seTextWidth) / 2;
    const seY = boxY + (boxH - seTextHeight) / 2 + 8;
    page.drawText(seText, { x: seX, y: seY, size: seFontSize, font: fontBold, color: negro });

    const fechaText = solicitud.fecha || '';
    const fechaFontSize = 10;
    const fechaTextWidth = font.widthOfTextAtSize(fechaText, fechaFontSize);
    const fechaX = boxX + (boxW - fechaTextWidth) / 2;
    page.drawText(fechaText, { x: fechaX, y: boxY + 6, size: fechaFontSize, font, color: negro });
    page.drawLine({ start: { x: 0, y: 1010 }, end: { x: 800, y: 1010 }, color: negro, thickness: 1 });

    // CÓDIGO DE BARRAS
    const barcodePNG = await generarBarcodePNG(solicitud.guia_caex_referencia || '411972366-1');
    if (barcodePNG) {
        const barcodeImg = await pdfDoc.embedPng(barcodePNG);
        page.drawImage(barcodeImg, { x: 200, y: 930, width: 400, height: 80 });
    }
    page.drawLine({ start: { x: 0, y: 930 }, end: { x: 800, y: 930 }, color: negro, thickness: 1 });

    // GRID PRINCIPAL
    page.drawRectangle({ x: 0, y: 600, width: 480, height: 330, borderColor: negro, borderWidth: 0 });
    page.drawLine({ start: { x: 480, y: 600 }, end: { x: 480, y: 930 }, color: negro, thickness: 3 });
    page.drawRectangle({ x: 480, y: 600, width: 320, height: 330, borderColor: negro, borderWidth: 0 });
    page.drawLine({ start: { x: 0, y: 600 }, end: { x: 800, y: 600 }, color: negro, thickness: 3 });

    // FILAS DE INFORMACIÓN (izquierda)
    let yInfo = 920;

    // Remitente
    page.drawLine({ start: { x: 0, y: yInfo }, end: { x: 480, y: yInfo }, color: negro, thickness: 1 });
    page.drawText('Remitente', { x: 15, y: yInfo - 18, size: 9, font: fontBold, color: negro });
    page.drawText((solicitud.remitente || 'TECHCOMM WIRELESS GUATEMALA'), { x: 15, y: yInfo - 32, size: 11, font, color: negro });
    yInfo -= 40;

    // Teléfono Remitente
    page.drawLine({ start: { x: 0, y: yInfo }, end: { x: 480, y: yInfo }, color: negro, thickness: 1 });
    page.drawText('Teléfono', { x: 15, y: yInfo - 18, size: 9, font: fontBold, color: negro });
    page.drawText((solicitud.telefono_remitente || '809 5655986'), { x: 15, y: yInfo - 32, size: 11, font, color: negro });
    yInfo -= 40;

    // Nombre Destinatario y Teléfono
    page.drawLine({ start: { x: 0, y: yInfo }, end: { x: 480, y: yInfo }, color: negro, thickness: 1 });
    page.drawLine({ start: { x: 240, y: yInfo }, end: { x: 240, y: yInfo - 40 }, color: negro, thickness: 1 });
    page.drawText('Nombre Destinatario', { x: 15, y: yInfo - 18, size: 9, font: fontBold, color: negro });
    const destName = solicitud.info_entrega?.nombreEntrega || solicitud.destinatario || 'Juan';
    page.drawText(destName.substring(0, 30), { x: 15, y: yInfo - 32, size: 11, font, color: negro });
    page.drawText('Teléfono', { x: 250, y: yInfo - 18, size: 9, font: fontBold, color: negro });
    page.drawText((solicitud.info_entrega?.telefono || solicitud.telefono_destinatario || 'Unknown'), { x: 250, y: yInfo - 32, size: 11, font, color: negro });
    yInfo -= 40;

    // Dirección Exacta
    page.drawLine({ start: { x: 0, y: yInfo }, end: { x: 480, y: yInfo }, color: negro, thickness: 1 });
    page.drawText('Dirección Exacta', { x: 15, y: yInfo - 18, size: 9, font: fontBold, color: negro });
    const direccion = solicitud.info_entrega?.direccion || solicitud.direccion || '7 calle 24 - 53';
    page.drawText(direccion.substring(0, 75), { x: 15, y: yInfo - 32, size: 10, font, color: negro });
    yInfo -= 40;

    // Referencia 1
    page.drawLine({ start: { x: 0, y: yInfo }, end: { x: 480, y: yInfo }, color: negro, thickness: 1 });
    page.drawText('Referencia 1', { x: 15, y: yInfo - 18, size: 9, font: fontBold, color: negro });
    page.drawText((solicitud.referencia1 || 'DETRAS DE CENTRO COMERCIAL PLAZA NARANJO'), { x: 15, y: yInfo - 32, size: 11, font, color: negro });
    yInfo -= 40;

    // Referencia 2 (Nota)
    page.drawLine({ start: { x: 0, y: yInfo }, end: { x: 480, y: yInfo }, color: negro, thickness: 1 });
    page.drawText('Nota / Referencia 2', { x: 15, y: yInfo - 18, size: 9, font: fontBold, color: negro });
    page.drawText((solicitud.info_entrega?.nota || solicitud.referencia2 || 'N/A').substring(0, 50), { x: 15, y: yInfo - 32, size: 11, font, color: negro });

    // BOXES LATERALES
    let yBox = 920;
    const sideBoxes = [
        { label: 'Origen', value: (solicitud.origen || 'SLA'), size: 24 },
        { label: 'Peso', value: (solicitud.peso ? solicitud.peso + 'lbs' : '1lbs'), size: 24 },
        { label: 'Destino', value: (solicitud.destino || 'GUA6'), size: 24 },
        { label: 'Poblado', value: (solicitud.poblado || 'GUA6'), size: 18, extra: (solicitud.dias ? (solicitud.dias + ' días') : 'L,K,M,J,V,S') },
        { label: 'PAQUETE', value: '', size: 16 },
    ];
    sideBoxes.forEach(({ label, value, size, extra }) => {
        page.drawLine({ start: { x: 480, y: yBox }, end: { x: 800, y: yBox }, color: negro, thickness: 1 });
        page.drawText(label, { x: 500, y: yBox - 18, size: 9, font: fontBold, color: negro });
        if (value) page.drawText(value.toString(), { x: 500, y: yBox - 38, size, font: fontBold, color: negro });
        if (extra) page.drawText(extra, { x: 500, y: yBox - 55, size: 10, font, color: negro });
        yBox -= 66;
    });

    // Descargar PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Guia_${solicitud.guia_caex_referencia || 'guia'}.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}
