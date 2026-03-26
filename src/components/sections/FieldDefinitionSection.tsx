import React from 'react';
import { Field, FieldMapping } from '../types/fieldTypes';
import { QRCodeFieldEditor } from '../QRCodeField';

interface FieldDefinitionSectionProps {
  showFieldDefinition: boolean;
  fields: Field[];
  selectedFieldIndex: number;
  fieldMappings: FieldMapping[];
  isFontsLoading: boolean;
  fontsLoaded: boolean;
  availableFonts: any[];
  showFontDropdown: number;
  fontSearchTerm: string;
  fontDetectionMethod: 'api' | 'fallback' | 'none';
  filteredFonts: any[];
  onFieldNameChange: (index: number, name: string) => void;
  onFieldDemoTextChange: (index: number, text: string) => void;
  onFieldFontSizeChange: (index: number, size: number) => void;
  onFieldFontChange: (index: number, font: string) => void;
  onFieldColorChange: (index: number, color: string) => void;
  onFieldAlignmentChange: (index: number, align: string) => void;
  onFieldSelect: (id: number) => void;
  onFieldRemove: (index: number) => void;
  onClearAllFields: () => void;
  onToggleFontDropdown: (index: number) => void;
  onFontSearchChange: (term: string) => void;
  onCloseFontDropdown: () => void;
  onFieldUpdate: (index: number, field: Field) => void;
}

export const FieldDefinitionSection: React.FC<FieldDefinitionSectionProps> = ({
  showFieldDefinition,
  fields,
  selectedFieldIndex,
  fieldMappings,
  isFontsLoading,
  fontsLoaded,
  availableFonts,
  showFontDropdown,
  fontSearchTerm,
  fontDetectionMethod,
  filteredFonts,
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
}) => {
  if (!showFieldDefinition) return null;

  const COLOR_PRESETS = [
    { value: '#000000', name: 'Black' },
    { value: '#ffffff', name: 'White' },
    { value: '#ef4444', name: 'Red' },
    { value: '#3b82f6', name: 'Blue' },
    { value: '#10b981', name: 'Green' },
    { value: '#f59e0b', name: 'Amber' },
  ];

  const TEXT_ALIGN_OPTIONS = [
    { value: 'left', name: 'Left' },
    { value: 'center', name: 'Center' },
    { value: 'right', name: 'Right' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-4">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3"
          style={{
            background: 'linear-gradient(90deg, #10b981 0%, #14b8a6 100%)',
            color: '#ffffff'
          }}
        >
          2
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Text Fields</h3>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-blue-700 text-sm">Click on the preview to add text fields. Use demo text to preview positioning. Drag fields to move, scroll over fields to resize.</p>
        <div className="mt-2 text-xs text-blue-600">
          <p className="font-medium mb-1">Text Formatting (Markdown-style):</p>
          <div className="space-y-1">
            <p>• <strong>**Bold text**</strong> - Use double asterisks</p>
            <p>• <em>*Italic text*</em> - Use single asterisks</p>
            <p>• <u>__Underlined text__</u> - Use double underscores</p>
            <p>• <s>~~Strikethrough text~~</s> - Use double tildes</p>
          </div>
        </div>
        {isFontsLoading && (
          <div className="mt-3 flex items-center text-blue-600 text-sm">
            <svg className="animate-spin w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Detecting system fonts... ({availableFonts.length} found)
          </div>
        )}
        {fontsLoaded && !isFontsLoading && (
          <div className="mt-3 space-y-2">
            <div className="text-blue-600 text-sm">
              ✓ Found {availableFonts.length} fonts 
              {fontDetectionMethod === 'api' && <span className="text-blue-700 ml-1">(Full access)</span>}
              {fontDetectionMethod === 'fallback' && <span className="text-orange-600 ml-1">(Limited)</span>}
              {fontDetectionMethod === 'none' && <span className="text-red-600 ml-1">(Default only)</span>}
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-3 mb-4">
        {fields.map((field, index) => (
          <div key={index} className={`p-3 rounded-lg border ${selectedFieldIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
            <div className="flex items-center mb-2 gap-1">
              <input
                type="text"
                value={field.name}
                onChange={(e) => onFieldNameChange(index, e.target.value)}
                placeholder="Field Name"
                className="bg-white border border-gray-300 text-gray-900 px-2 py-1 rounded text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded flex-shrink-0">
                {field.type === 'text' ? 'Text' : 'QR'}
              </span>
              <button
                type="button"
                onClick={() => onFieldSelect(index)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex-shrink-0 inline-flex items-center justify-center"
                style={{ width: '1.75rem', height: '1.75rem', minWidth: '1.75rem', minHeight: '1.75rem', lineHeight: 0 }}
                title="Select Field"
              >
                <svg className="w-3 h-3 flex-shrink-0" style={{ width: '0.75rem', height: '0.75rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onFieldRemove(index)}
                className="bg-red-600 hover:bg-red-700 text-white rounded transition-colors flex-shrink-0 inline-flex items-center justify-center"
                style={{ width: '1.75rem', height: '1.75rem', minWidth: '1.75rem', minHeight: '1.75rem', lineHeight: 0 }}
                title="Delete Field"
              >
                <svg className="w-3 h-3 flex-shrink-0" style={{ width: '0.75rem', height: '0.75rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={field.demoText}
              onChange={(e) => onFieldDemoTextChange(index, e.target.value)}
              placeholder="Demo text"
              className="bg-white border border-gray-300 text-gray-900 px-2 py-1 rounded text-sm w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            {field.type === 'text' ? (
              <>
                {/* Text Field Controls */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="number"
                    value={field.fontSize}
                    onChange={(e) => onFieldFontSizeChange(index, parseInt(e.target.value))}
                    placeholder="Font Size"
                    className="bg-white border border-gray-300 text-gray-900 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {/* Font Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => onToggleFontDropdown(index)}
                      className="font-dropdown-trigger w-full bg-white border border-gray-300 text-gray-900 px-2 py-1 rounded text-sm text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isFontsLoading}
                    >
                      <span className="truncate">
                        {isFontsLoading ? 'Loading fonts...' : 
                         (availableFonts.find(font => font.value === field.fontFamily)?.name || 'Arial')}
                      </span>
                      <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    
                    {showFontDropdown === index && (
                      <div className="font-dropdown absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                        {/* Search Input */}
                        <div className="p-2 border-b border-gray-200">
                          <input
                            type="text"
                            value={fontSearchTerm}
                            onChange={(e) => onFontSearchChange(e.target.value)}
                            placeholder="Search fonts..."
                            className="w-full bg-white border border-gray-300 text-gray-900 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                          />
                        </div>
                        
                        {/* Font List */}
                        <div className="overflow-y-auto max-h-48">
                          {filteredFonts.length > 0 ? (
                            filteredFonts.map(font => (
                              <button
                                key={font.value}
                                type="button"
                                onClick={() => {
                                  onFieldFontChange(index, font.value);
                                  onCloseFontDropdown();
                                }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                  field.fontFamily === font.value ? 'bg-blue-600 text-white' : 'text-gray-700'
                                }`}
                                style={{ fontFamily: font.value }}
                              >
                                {font.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No fonts found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Text Color Controls */}
                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-2">Text Color</label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {COLOR_PRESETS.map(color => (
                        <button
                          key={color.value}
                          onClick={() => onFieldColorChange(index, color.value)}
                          className={`w-6 h-6 rounded border-2 ${field.color === color.value ? 'border-gray-800' : 'border-gray-300'} hover:border-gray-800 transition-colors`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <details className="mt-2">
                      <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">Custom Color</summary>
                      <input
                        type="color"
                        value={field.color}
                        onChange={(e) => onFieldColorChange(index, e.target.value)}
                        className="w-full h-8 bg-white border border-gray-300 rounded cursor-pointer mt-1"
                      />
                    </details>
                  </div>
                </div>

                {/* Text Alignment Controls */}
                <div className="mt-3">
                  <label className="block text-gray-700 text-xs font-medium mb-2">Text Alignment</label>
                  <div className="flex gap-2">
                    {TEXT_ALIGN_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => onFieldAlignmentChange(index, option.value)}
                        className={`flex-1 px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center justify-center
                          ${field.textAlign === option.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-blue-600 hover:bg-blue-100 border border-gray-300'}
                        `}
                        title={option.name}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* QR Code Field Controls */}
                <QRCodeFieldEditor
                  field={field}
                  onUpdate={(updatedField) => onFieldUpdate(index, updatedField)}
                />
              </>
            )}
          </div>
        ))}
      </div>
      
      <button 
        onClick={onClearAllFields}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm shadow-md"
      >
        Clear All
      </button>
    </div>
  );
};
