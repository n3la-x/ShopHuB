const ExcelJS = require('exceljs');

class ExportService {
  async exportToExcel(data, columns, sheetName) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(sheetName);
    sheet.columns = columns.map(col => ({ header: col.label, key: col.key, width: col.width || 20 }));
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    data.forEach(row => sheet.addRow(row));
    return workbook;
  }

  exportToCSV(data, columns) {
    const header = columns.map(c => c.label).join(',');
    const rows = data.map(row => columns.map(c => `"${row[c.key] ?? ''}"`).join(','));
    return [header, ...rows].join('\n');
  }

  exportToJSON(data) {
    return JSON.stringify(data, null, 2);
  }
}

module.exports = new ExportService();
