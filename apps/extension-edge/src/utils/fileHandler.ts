/**
 * File download and upload utilities
 */

import mammoth from 'mammoth';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Download code as a text file
 */
export function downloadCode(code: string): void {
  const timestamp = new Date().toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '')
    .replace('T', '_');
  const filename = `pseudocode_${timestamp}.txt`;

  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Read a text or docx file and return its contents
 */
export function readFile(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    // Check file type
    const fileName = file.name.toLowerCase();
    const isTextFile = fileName.endsWith('.txt');
    const isDocxFile = fileName.endsWith('.docx');

    if (!isTextFile && !isDocxFile) {
      reject(new Error('Invalid file type. Only .txt and .docx files are supported.'));
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error('File too large. Maximum size is 5MB.'));
      return;
    }

    try {
      if (isTextFile) {
        // Handle .txt files
        const reader = new FileReader();

        reader.onload = (event) => {
          const content = event.target?.result;
          if (typeof content === 'string') {
            resolve(content);
          } else {
            reject(new Error('Could not read file. Please try again.'));
          }
        };

        reader.onerror = () => {
          reject(new Error('Could not read file. Please try again.'));
        };

        reader.readAsText(file);
      } else if (isDocxFile) {
        // Handle .docx files
        const content = await parseDocxFile(file);
        resolve(content);
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Parse a .docx file and extract plain text content
 */
export async function parseDocxFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    throw new Error('Could not parse .docx file. The file may be corrupted.');
  }
}
