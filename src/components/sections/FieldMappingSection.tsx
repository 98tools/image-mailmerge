import React from 'react';
import { FieldMapping, FileNameMapping } from '../types/fieldTypes';

interface FieldMappingSectionProps {
  showSection: boolean;
  fieldMappings: FieldMapping[];
  fileNameMapping: FileNameMapping;
  csvHeaders: string[];
  onFieldMappingChange: (fieldName: string, csvColumn: string) => void;
  onFileNameMappingChange: (csvColumn: string) => void;
  onFileNameNumberingChange: (includeNumbering: boolean) => void;
  onClearAllMappings: () => void;
}

export const FieldMappingSection: React.FC<FieldMappingSectionProps> = ({
  showSection,
  fieldMappings,
  fileNameMapping,
  csvHeaders,
  onFieldMappingChange,
  onFileNameMappingChange,
  onFileNameNumberingChange,
  onClearAllMappings,
}) => {
  if (!showSection) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
          4
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Field Mapping</h3>
      </div>
      
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
        <p className="text-purple-700 text-sm">Map your template fields to spreadsheet columns. Unmapped fields will be left empty.</p>
      </div>
      
      <div className="space-y-3 mb-4">
        {/* File Name Mapping */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <span className="text-sm font-medium text-indigo-700">Custom File Names</span>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm text-gray-700 min-w-[80px]">file_name:</span>
            <div className="flex-1 min-w-0">
              <select
                value={fileNameMapping.csvColumn || ''}
                onChange={(e) => onFileNameMappingChange(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 px-2 py-1 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Use Default (image_0001.png) --</option>
                {csvHeaders.map(header => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
            </div>
          </div>
          {fileNameMapping.csvColumn && (
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id="includeNumbering"
                checked={fileNameMapping.includeNumbering}
                onChange={(e) => onFileNameNumberingChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="includeNumbering" className="text-sm text-gray-700">
                Include numbering prefix (0001_filename.png)
              </label>
            </div>
          )}
          <p className="text-xs text-indigo-600 mt-2">
            Optional: Select a spreadsheet column to use custom file names. Files will be automatically saved as .png
            {fileNameMapping.csvColumn && !fileNameMapping.includeNumbering && (
              <span className="block mt-1 text-orange-600">⚠️ Without numbering, duplicate filenames will overwrite each other</span>
            )}
          </p>
        </div>

        {/* Field Mappings */}
        {fieldMappings.map((mapping, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 min-w-[80px]">{mapping.fieldName}:</span>
            <select
              value={mapping.csvColumn || ''}
              onChange={(e) => onFieldMappingChange(mapping.fieldName, e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 px-2 py-1 rounded text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select Column --</option>
              {csvHeaders.map(header => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={onClearAllMappings}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-md"
        >
          Clear All Mappings
        </button>
      </div>
    </div>
  );
};
