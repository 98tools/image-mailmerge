import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const normalizeCellValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return String(value);
};

const normalizeHeaderValue = (header: unknown, index: number): string => {
  const normalized = normalizeCellValue(header).trim();
  return normalized || `Column ${index + 1}`;
};

// CSV row interface
export interface CSVRow {
  [key: string]: string;
}

// Spreadsheet parse result interface
export interface SpreadsheetParseResult {
  data: CSVRow[];
  headers: string[];
  error?: string;
}

// Function to parse different spreadsheet formats
export const parseSpreadsheetFile = async (file: File): Promise<SpreadsheetParseResult> => {
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split('.').pop();

  try {
    if (fileExtension === 'csv') {
      // Use PapaParse for CSV files
      return new Promise((resolve) => {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            const rawData = results.data as Record<string, unknown>[];
            const headers = (results.meta.fields || []).map((field, index) =>
              normalizeHeaderValue(field, index)
            );

            const data = rawData.map((row) => {
              const normalizedRow: CSVRow = {};
              headers.forEach((header) => {
                normalizedRow[header] = normalizeCellValue(row[header]);
              });
              return normalizedRow;
            });
            resolve({ data, headers });
          },
          error: (error) => {
            resolve({ data: [], headers: [], error: error.message });
          }
        });
      });
    } else if (['xls', 'xlsx', 'ods'].includes(fileExtension || '')) {
      // Use XLSX for Excel and ODS files
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(uint8Array, { type: 'array' });
            
            // Get the first worksheet
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            
            // Convert to JSON with headers
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
            
            if (jsonData.length === 0) {
              resolve({ data: [], headers: [], error: 'Spreadsheet is empty' });
              return;
            }
            
            // First row contains headers
            const headers = jsonData[0].map((header, index) =>
              normalizeHeaderValue(header, index)
            );
            const rows = jsonData.slice(1);
            
            // Convert to CSVRow format
            const parsedData: CSVRow[] = rows.map(row => {
              const rowObject: CSVRow = {};
              headers.forEach((header, index) => {
                rowObject[header] = normalizeCellValue(row[index]);
              });
              return rowObject;
            });
            
            resolve({ data: parsedData, headers });
          } catch (error) {
            resolve({ data: [], headers: [], error: (error as Error).message });
          }
        };
        reader.onerror = () => {
          resolve({ data: [], headers: [], error: 'Failed to read file' });
        };
        reader.readAsArrayBuffer(file);
      });
    } else {
      return { data: [], headers: [], error: `Unsupported file format: ${fileExtension}` };
    }
  } catch (error) {
    return { data: [], headers: [], error: (error as Error).message };
  }
};