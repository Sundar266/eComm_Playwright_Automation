import fs from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

export async function getPdfContent(filePath) {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });

  try {
    const [textResult, infoResult] = await Promise.all([
      parser.getText(),
      parser.getInfo()
    ]);

    return {
      text: textResult.text,
      numberOfPages: infoResult.total,
      metadata: infoResult.info ?? {}
    };
  } finally {
    await parser.destroy();
  }
}
