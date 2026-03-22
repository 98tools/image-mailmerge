import React from 'react';
import { CSVRow, Field, FieldMapping, FileNameMapping } from '../types/fieldTypes';
import { ImageUploadSection } from './ImageUploadSection';
import { FieldDefinitionSection } from './FieldDefinitionSection';
import { SpreadsheetSection } from './SpreadsheetSection';
import { FieldMappingSection } from './FieldMappingSection';
import { GenerateImagesSection } from './GenerateImagesSection';
import { getUnmappedFields } from '../fields/fieldManagement';

interface SidebarProps {
  sidebarWidth: number;
  isFullscreen: boolean;
  templateImage: File | null;
  csvData: CSVRow[] | null;
  csvHeaders: string[];
  fields: Field[];
  fieldMappings: FieldMapping[];
  fileNameMapping: FileNameMapping;
  currentCsvRowIndex: number;
  selectedFieldIndex: number;
  showFieldDefinition: boolean;
  isImageLoading: boolean;
  isProcessing: boolean;
  progress: number;
  progressText: string;
  showZoomControls: boolean;
  
  // Font management
  isFontsLoading: boolean;
  fontsLoaded: boolean;
  availableFonts: any[];
  showFontDropdown: number;
  fontSearchTerm: string;
  fontDetectionMethod: 'api' | 'fallback' | 'none';
  filteredFonts: any[];
  
  // Callbacks
  onToggleFullscreen: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSpreadsheetUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFieldNameChange: (index: number, name: string) => void;
  onFieldDemoTextChange: (index: number, text: string) => void;
  onFieldFontSizeChange: (index: number, size: number) => void;
  onFieldFontChange: (index: number, font: string) => void;
  onFieldColorChange: (index: number, color: string) => void;
  onFieldAlignmentChange: (index: number, align: string) => void;
  onFieldSelect: (index: number) => void;
  onFieldRemove: (index: number) => void;
  onClearAllFields: () => void;
  onToggleFontDropdown: (index: number) => void;
  onFontSearchChange: (term: string) => void;
  onCloseFontDropdown: () => void;
  onFieldUpdate: (index: number, field: Field) => void;
  onPreviousRow: () => void;
  onNextRow: () => void;
  onFieldMappingChange: (fieldName: string, csvColumn: string) => void;
  onFileNameMappingChange: (csvColumn: string) => void;
  onFileNameNumberingChange: (includeNumbering: boolean) => void;
  onClearAllMappings: () => void;
  onGenerateImages: () => void;
  getCurrentRowData: () => CSVRow | null;
  isReadyToGenerate: boolean;
  onSidebarResizeStart: (e: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarWidth,
  isFullscreen,
  templateImage,
  csvData,
  csvHeaders,
  fields,
  fieldMappings,
  fileNameMapping,
  currentCsvRowIndex,
  selectedFieldIndex,
  showFieldDefinition,
  isImageLoading,
  isProcessing,
  progress,
  progressText,
  showZoomControls,
  isFontsLoading,
  fontsLoaded,
  availableFonts,
  showFontDropdown,
  fontSearchTerm,
  fontDetectionMethod,
  filteredFonts,
  onToggleFullscreen,
  onImageUpload,
  onSpreadsheetUpload,
  onFieldNameChange,
  onFieldDemoTextChange,
  onFieldFontSizeChange,
  onFieldFontChange,
  onFieldColorChange,
  onFieldAlignmentChange,
  onFieldSelect,
  onFieldRemove,
  onClearAllFields,
  onToggleFontDropdown,
  onFontSearchChange,
  onCloseFontDropdown,
  onFieldUpdate,
  onPreviousRow,
  onNextRow,
  onFieldMappingChange,
  onFileNameMappingChange,
  onFileNameNumberingChange,
  onClearAllMappings,
  onGenerateImages,
  getCurrentRowData,
  isReadyToGenerate,
  onSidebarResizeStart,
}) => {
  return (
    <div 
      className="bg-white border-r border-gray-200 flex flex-col overflow-y-auto transition-all duration-300"
      style={{ width: sidebarWidth, minWidth: 300, maxWidth: 600 }}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            Options
            {isFullscreen && (
              <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                Fullscreen Mode
              </span>
            )}
          </h2>
          <button 
            onClick={onToggleFullscreen} 
            title={isFullscreen ? "Exit Fullscreen (F11)" : "Enter Fullscreen (F11)"} 
            className="bg-gray-100 hover:bg-gray-50 text-gray-700 p-2 rounded-lg transition-colors border border-gray-300"
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15H4.5M9 15v4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-6 mb-20">
        {/* Image Upload Section */}
        <ImageUploadSection
          isImageLoading={isImageLoading}
          onImageUpload={onImageUpload}
        />

        {/* Field Definition Section */}
        <FieldDefinitionSection
          showFieldDefinition={showFieldDefinition}
          fields={fields}
          selectedFieldIndex={selectedFieldIndex}
          fieldMappings={fieldMappings}
          isFontsLoading={isFontsLoading}
          fontsLoaded={fontsLoaded}
          availableFonts={availableFonts}
          showFontDropdown={showFontDropdown}
          fontSearchTerm={fontSearchTerm}
          fontDetectionMethod={fontDetectionMethod}
          filteredFonts={filteredFonts}
          onFieldNameChange={onFieldNameChange}
          onFieldDemoTextChange={onFieldDemoTextChange}
          onFieldFontSizeChange={onFieldFontSizeChange}
          onFieldFontChange={onFieldFontChange}
          onFieldColorChange={onFieldColorChange}
          onFieldAlignmentChange={onFieldAlignmentChange}
          onFieldSelect={onFieldSelect}
          onFieldRemove={onFieldRemove}
          onClearAllFields={onClearAllFields}
          onToggleFontDropdown={onToggleFontDropdown}
          onFontSearchChange={onFontSearchChange}
          onCloseFontDropdown={onCloseFontDropdown}
          onFieldUpdate={onFieldUpdate}
        />

        {/* Spreadsheet Upload Section */}
        <SpreadsheetSection
          csvData={csvData}
          csvHeaders={csvHeaders}
          currentCsvRowIndex={currentCsvRowIndex}
          fields={fields}
          fieldMappings={fieldMappings}
          onSpreadsheetUpload={onSpreadsheetUpload}
          onPreviousRow={onPreviousRow}
          onNextRow={onNextRow}
          getCurrentRowData={getCurrentRowData}
        />

        {/* Field Mapping Section */}
        <FieldMappingSection
          showSection={csvData !== null && fields.length > 0}
          fieldMappings={fieldMappings}
          fileNameMapping={fileNameMapping}
          csvHeaders={csvHeaders}
          onFieldMappingChange={onFieldMappingChange}
          onFileNameMappingChange={onFileNameMappingChange}
          onFileNameNumberingChange={onFileNameNumberingChange}
          onClearAllMappings={onClearAllMappings}
        />

        {/* Generate Images Section */}
        <GenerateImagesSection
          isReadyToGenerate={isReadyToGenerate}
          isProcessing={isProcessing}
          progress={progress}
          progressText={progressText}
          csvDataLength={csvData?.length}
          templateImage={templateImage}
          fieldsLength={fields.length}
          csvData={csvData !== null}
          unmappedFieldsCount={getUnmappedFields(fields, fieldMappings).length}
          onGenerateImages={onGenerateImages}
        />
      </div>
    </div>
  );
};
