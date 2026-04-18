/**
 * Export Service
 * Handles exporting code as PDF, PNG image, and print
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  title?: string;
  includeLineNumbers?: boolean;
  fontSize?: number;
  theme?: 'light' | 'dark';
}

/**
 * Export code as PDF
 */
export async function exportAsPDF(code: string, options: ExportOptions = {}): Promise<void> {
  const {
    title = 'Pseudocode',
    includeLineNumbers = true,
    fontSize = 11,
    theme = 'light'
  } = options;

  try {
    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.style.padding = '40px';
    container.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff';
    container.style.color = theme === 'dark' ? '#d4d4d4' : '#000000';
    container.style.fontFamily = 'Consolas, Monaco, "Courier New", monospace';
    container.style.fontSize = `${fontSize}px`;
    container.style.lineHeight = '1.6';
    document.body.appendChild(container);

    // Add title
    const titleElement = document.createElement('h1');
    titleElement.textContent = title;
    titleElement.style.marginBottom = '20px';
    titleElement.style.fontSize = '24px';
    titleElement.style.fontWeight = 'bold';
    container.appendChild(titleElement);

    // Add date
    const dateElement = document.createElement('p');
    dateElement.textContent = `Generated on ${new Date().toLocaleDateString()}`;
    dateElement.style.marginBottom = '20px';
    dateElement.style.fontSize = '12px';
    dateElement.style.color = theme === 'dark' ? '#888' : '#666';
    container.appendChild(dateElement);

    // Add code
    const codeElement = document.createElement('pre');
    codeElement.style.whiteSpace = 'pre-wrap';
    codeElement.style.wordWrap = 'break-word';
    codeElement.style.margin = '0';

    if (includeLineNumbers) {
      const lines = code.split('\n');
      const numberedCode = lines.map((line, index) => {
        const lineNum = String(index + 1).padStart(3, ' ');
        return `${lineNum} | ${line}`;
      }).join('\n');
      codeElement.textContent = numberedCode;
    } else {
      codeElement.textContent = code;
    }

    container.appendChild(codeElement);

    // Convert to canvas
    const canvas = await html2canvas(container, {
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
      scale: 2
    });

    // Remove temporary container
    document.body.removeChild(container);

    // Create PDF
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download PDF
    const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting as PDF:', error);
    throw new Error('Failed to export as PDF');
  }
}

/**
 * Export code as PNG image
 */
export async function exportAsPNG(code: string, options: ExportOptions = {}): Promise<void> {
  const {
    title = 'Pseudocode',
    includeLineNumbers = true,
    fontSize = 14,
    theme = 'light'
  } = options;

  try {
    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '1000px';
    container.style.padding = '40px';
    container.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff';
    container.style.color = theme === 'dark' ? '#d4d4d4' : '#000000';
    container.style.fontFamily = 'Consolas, Monaco, "Courier New", monospace';
    container.style.fontSize = `${fontSize}px`;
    container.style.lineHeight = '1.6';
    container.style.borderRadius = '8px';
    document.body.appendChild(container);

    // Add title
    const titleElement = document.createElement('h1');
    titleElement.textContent = title;
    titleElement.style.marginBottom = '20px';
    titleElement.style.fontSize = '28px';
    titleElement.style.fontWeight = 'bold';
    container.appendChild(titleElement);

    // Add code
    const codeElement = document.createElement('pre');
    codeElement.style.whiteSpace = 'pre-wrap';
    codeElement.style.wordWrap = 'break-word';
    codeElement.style.margin = '0';

    if (includeLineNumbers) {
      const lines = code.split('\n');
      const numberedCode = lines.map((line, index) => {
        const lineNum = String(index + 1).padStart(3, ' ');
        return `${lineNum} | ${line}`;
      }).join('\n');
      codeElement.textContent = numberedCode;
    } else {
      codeElement.textContent = code;
    }

    container.appendChild(codeElement);

    // Convert to canvas
    const canvas = await html2canvas(container, {
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
      scale: 2
    });

    // Remove temporary container
    document.body.removeChild(container);

    // Download as PNG
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.png`;
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  } catch (error) {
    console.error('Error exporting as PNG:', error);
    throw new Error('Failed to export as PNG');
  }
}

/**
 * Print code
 */
export function printCode(code: string, options: ExportOptions = {}): void {
  const {
    title = 'Pseudocode',
    includeLineNumbers = true,
    fontSize = 12,
    theme = 'light'
  } = options;

  try {
    // Create print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Failed to open print window. Please allow popups.');
    }

    // Prepare code with line numbers if needed
    let codeContent = code;
    if (includeLineNumbers) {
      const lines = code.split('\n');
      codeContent = lines.map((line, index) => {
        const lineNum = String(index + 1).padStart(3, ' ');
        return `${lineNum} | ${line}`;
      }).join('\n');
    }

    // Write HTML content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          @page {
            margin: 2cm;
          }

          body {
            font-family: Consolas, Monaco, 'Courier New', monospace;
            font-size: ${fontSize}px;
            line-height: 1.6;
            color: ${theme === 'dark' ? '#d4d4d4' : '#000000'};
            background-color: ${theme === 'dark' ? '#1e1e1e' : '#ffffff'};
            margin: 0;
            padding: 20px;
          }

          h1 {
            font-size: 24px;
            margin-bottom: 10px;
            font-weight: bold;
          }

          .date {
            font-size: 12px;
            color: ${theme === 'dark' ? '#888' : '#666'};
            margin-bottom: 20px;
          }

          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 0;
          }

          @media print {
            body {
              background-color: white;
              color: black;
            }

            .date {
              color: #666;
            }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p class="date">Generated on ${new Date().toLocaleDateString()}</p>
        <pre>${codeContent}</pre>
      </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  } catch (error) {
    console.error('Error printing code:', error);
    throw new Error('Failed to print code');
  }
}
