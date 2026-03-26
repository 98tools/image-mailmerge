import React from 'react';

interface GenerateImagesSectionProps {
  isReadyToGenerate: boolean;
  isProcessing: boolean;
  progress: number;
  progressText: string;
  csvDataLength: number | undefined;
  templateImage: File | null;
  fieldsLength: number;
  csvData: boolean;
  unmappedFieldsCount: number;
  onGenerateImages: () => void;
}

export const GenerateImagesSection: React.FC<GenerateImagesSectionProps> = ({
  isReadyToGenerate,
  isProcessing,
  progress,
  progressText,
  csvDataLength,
  templateImage,
  fieldsLength,
  csvData,
  unmappedFieldsCount,
  onGenerateImages,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-4">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3"
          style={{
            background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
            color: '#ffffff'
          }}
        >
          5
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Generate Images</h3>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <div className="flex items-center mb-2">
            <span className="text-sm text-gray-700">Generating Images...</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-700 whitespace-nowrap min-w-[120px]">
              {progressText || `${Math.round(progress)}%`}
            </span>
          </div>
        </div>
      )}

      <button 
        onClick={onGenerateImages}
        disabled={!isReadyToGenerate || isProcessing}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
      >
        <span className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          {isProcessing ? 'Generating...' : 'Generate Images'}
        </span>
      </button>

      {!isReadyToGenerate && !isProcessing && (
        <div className="mt-3 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2">
          {!templateImage && "• Upload a template image"}
          {templateImage && fieldsLength === 0 && "• Add text fields by clicking on the preview"}
          {templateImage && fieldsLength > 0 && !csvData && "• Upload spreadsheet data"}
          {templateImage && fieldsLength > 0 && csvData && unmappedFieldsCount > 0 && "• Map all fields to spreadsheet columns"}
        </div>
      )}
    </div>
  );
};
