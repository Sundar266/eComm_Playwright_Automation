import * as XLSX from 'xlsx';

function getWorksheet(filePath, sheetName) {
  const workbook = XLSX.readFile(filePath);
  const selectedSheet = sheetName ?? workbook.SheetNames[0];

  if (!workbook.Sheets[selectedSheet]) {
    throw new Error(`Worksheet "${selectedSheet}" was not found.`);
  }

  return workbook.Sheets[selectedSheet];
}

export function getCellValue(filePath, cellAddress, sheetName) {
  const worksheet = getWorksheet(filePath, sheetName);
  return worksheet[cellAddress]?.v ?? null;
}

export function getRowValues(filePath, rowNumber, sheetName) {
  if (!Number.isInteger(rowNumber) || rowNumber < 1) {
    throw new Error('rowNumber must be a positive 1-based number.');
  }

  const worksheet = getWorksheet(filePath, sheetName);
  const rows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
    raw: false
  });

  return rows[rowNumber - 1] ?? [];
}
