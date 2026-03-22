import { useState, useCallback } from 'react';
import { CSVRow, parseSpreadsheetFile } from '../components/data/spreadsheetUtils';
import { Field, FieldMapping, FileNameMapping } from '../components/types/fieldTypes';

export const useSpreadsheetData = (fields: Field[]) => {
  const [csvData, setCsvData] = useState<CSVRow[] | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [currentCsvRowIndex, setCurrentCsvRowIndex] = useState(0);
  const [fileNameMapping, setFileNameMapping] = useState<FileNameMapping>({ csvColumn: null, includeNumbering: true });

  const handleSpreadsheetUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, setFieldMappings: (mappings: FieldMapping[]) => void) => {
    const file = e.target.files?.[0];
    if (!file || file.size === 0) {
      alert('Please select a spreadsheet file');
      return;
    }

    console.log('Spreadsheet file selected:', file.name, file.size);
    
    try {
      const result = await parseSpreadsheetFile(file);
      
      if (result.error) {
        console.error('Spreadsheet parse error:', result.error);
        alert('Error parsing spreadsheet: ' + result.error);
        return;
      }

      console.log('Spreadsheet parsed:', result);
      console.log('Headers:', result.headers);
      console.log('Data rows:', result.data.length);
      
      const filteredData = result.data.filter(row => {
        return Object.values(row).some(value => String(value ?? '').trim() !== '');
      });
      
      setCsvData(filteredData);
      setCsvHeaders(result.headers);
      setCurrentCsvRowIndex(0);
      
      console.log('Filtered data:', filteredData.length, 'rows');
      
      if (fields.length > 0) {
        const mappings = fields.map(field => ({
          fieldName: field.name,
          csvColumn: null
        }));
        setFieldMappings(mappings);
      }
    } catch (error) {
      console.error('Spreadsheet processing error:', error);
      alert('Error processing spreadsheet: ' + (error as Error).message);
    }
  }, [fields]);

  const goToPreviousRow = useCallback(() => {
    setCurrentCsvRowIndex(prev => Math.max(0, prev - 1));
  }, []);

  const goToNextRow = useCallback(() => {
    setCurrentCsvRowIndex(prev => 
      csvData ? Math.min(csvData.length - 1, prev + 1) : prev
    );
  }, [csvData]);

  const goToRowIndex = useCallback((index: number) => {
    if (csvData && index >= 0 && index < csvData.length) {
      setCurrentCsvRowIndex(index);
    }
  }, [csvData]);

  const getCurrentRowData = useCallback(() => {
    if (!csvData || !csvData[currentCsvRowIndex]) return null;
    return csvData[currentCsvRowIndex];
  }, [csvData, currentCsvRowIndex]);

  return {
    csvData,
    setCsvData,
    csvHeaders,
    setCsvHeaders,
    currentCsvRowIndex,
    setCurrentCsvRowIndex,
    fileNameMapping,
    setFileNameMapping,
    handleSpreadsheetUpload,
    goToPreviousRow,
    goToNextRow,
    goToRowIndex,
    getCurrentRowData,
  };
};
