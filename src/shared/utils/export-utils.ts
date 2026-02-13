import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Exports data to an Excel file (.xlsx)
 */
export const exportToExcel = (data: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Exports data to a PDF file (.pdf)
 */
export const exportToPDF = (
    title: string,
    headers: string[][],
    data: any[][],
    fileName: string
) => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Add Date
    const dateStr = new Date().toLocaleString();
    doc.text(`Generado el: ${dateStr}`, 14, 30);

    // @ts-ignore
    autoTable(doc, {
        startY: 35,
        head: headers,
        body: data,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }, // Ceramdent Blue
        styles: { fontSize: 9 }
    });

    doc.save(`${fileName}.pdf`);
};
