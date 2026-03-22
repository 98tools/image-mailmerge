import React from 'react';
import { CSVRow, FieldMapping, Field } from '../types/fieldTypes';
import { getUnmappedFields } from '../fields/fieldManagement';

interface SpreadsheetSectionProps {
  csvData: CSVRow[] | null;
  csvHeaders: string[];
  currentCsvRowIndex: number;
  fields: Field[];
  fieldMappings: FieldMapping[];
  onSpreadsheetUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPreviousRow: () => void;
  onNextRow: () => void;
  getCurrentRowData: () => CSVRow | null;
}

export const SpreadsheetSection: React.FC<SpreadsheetSectionProps> = ({
  csvData,
  csvHeaders,
  currentCsvRowIndex,
  fields,
  fieldMappings,
  onSpreadsheetUpload,
  onPreviousRow,
  onNextRow,
  getCurrentRowData,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
          3
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Spreadsheet Data</h3>
      </div>
      
      <div>
        <label htmlFor="csvFile" className="cursor-pointer block">
          <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-orange-50 hover:bg-orange-100 transition-all duration-300 group">
            <svg className="w-12 h-12 text-orange-500 mx-auto mb-3 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span className="text-orange-600 font-medium">Upload Spreadsheet</span>
            <p className="text-xs text-orange-500 mt-1">CSV, XLS, XLSX, or ODS files</p>
          </div>
        </label>
        <input 
          type="file" 
          id="csvFile" 
          accept=".csv,.xls,.xlsx,.ods" 
          className="hidden" 
          onChange={onSpreadsheetUpload}
        />
      </div>
      
      {csvData && (
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              CSV Preview <br />
              ({csvData.length} rows)
            </h4>
            
            {/* CSV Row Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onPreviousRow}
                disabled={currentCsvRowIndex === 0}
                className="p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 border border-gray-300"
                title="Previous Row"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              
              <span className="text-xs text-gray-600 min-w-[60px] text-center">
                Row {currentCsvRowIndex + 1} of {csvData.length}
              </span>
              
              <button
                onClick={onNextRow}
                disabled={currentCsvRowIndex === csvData.length - 1}
                className="p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 border border-gray-300"
                title="Next Row"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Warning for unmapped fields */}
          {fields.length > 0 && getUnmappedFields(fields, fieldMappings).length > 0 && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-xs">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span>
                  <strong>Warning:</strong> {getUnmappedFields(fields, fieldMappings).length} field(s) not mapped: <br />
                  {getUnmappedFields(fields, fieldMappings).map(f => f.name).join(', ')}. <br />
                  Go to Field Mapping section below to map them.
                </span>
              </div>
            </div>
          )}

          {/* Current Row Data Display */}
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    {csvHeaders.map(header => (
                      <th key={header} className="px-2 py-1 text-left text-gray-700 font-medium">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  <tr className="border-b border-gray-200 bg-blue-50">
                    {csvHeaders.map(header => (
                      <td key={header} className="px-2 py-1 font-medium text-blue-700">
                        {getCurrentRowData()?.[header] || ''}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Show preview tip */}
          <div className="mt-2 text-xs text-gray-600 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Use ← → buttons to preview different rows. The canvas above shows actual data from the current row.
          </div>
        </div>
      )}
    </div>
  );
};
