import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'csv-parse/sync';

function getCellCoordinates(cellAddress) {
  const match = /^([A-Z]+)(\d+)$/i.exec(String(cellAddress || '').trim());

  if (!match) {
    throw new Error(`Invalid cell address: ${cellAddress}`);
  }

  const [, columnLabel, rowNumber] = match;
  let columnIndex = 0;

  for (const char of columnLabel.toUpperCase()) {
    columnIndex = (columnIndex * 26) + (char.charCodeAt(0) - 64);
  }

  return {
    rowNumber: Number(rowNumber),
    columnNumber: columnIndex
  };
}

export async function getCsvRecords(filePath, options = {}) {
  const content = await fs.readFile(filePath, 'utf8');

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    ...options
  });
}

export async function getCsvRows(filePath, options = {}) {
  const content = await fs.readFile(filePath, 'utf8');

  return parse(content, {
    skip_empty_lines: true,
    trim: true,
    ...options
  });
}

export async function getCsvCellValue(filePath, cellAddress, options = {}) {
  const rows = await getCsvRows(filePath, options);
  const { rowNumber, columnNumber } = getCellCoordinates(cellAddress);

  if (!rows[rowNumber - 1]) {
    return null;
  }

  return rows[rowNumber - 1][columnNumber - 1] ?? null;
}

export async function getCsvCellValues(filePath, cellAddresses, options = {}) {
  const values = [];

  for (const cellAddress of cellAddresses) {
    values.push(await getCsvCellValue(filePath, cellAddress, options));
  }

  return values;
}

export async function getLatestFileByPattern(directoryPath, filePattern) {
  const files = await fs.readdir(directoryPath, { withFileTypes: true });
  const regex = filePattern instanceof RegExp ? filePattern : new RegExp(filePattern);
  const fileMatches = [];

  for (const file of files) {
    if (!file.isFile()) {
      continue;
    }

    if (!regex.test(file.name)) {
      continue;
    }

    const filePath = path.join(directoryPath, file.name);
    const stats = await fs.stat(filePath);
    fileMatches.push({ filePath, mtimeMs: stats.mtimeMs });
  }

  if (fileMatches.length === 0) {
    return null;
  }

  fileMatches.sort((first, second) => second.mtimeMs - first.mtimeMs);
  return fileMatches[0].filePath;
}
