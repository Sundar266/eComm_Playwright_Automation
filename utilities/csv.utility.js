import fs from 'node:fs/promises';
import { parse } from 'csv-parse/sync';

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
