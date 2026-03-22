import React from 'react';

interface ImageUploadSectionProps {
  isImageLoading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  isImageLoading,
  onImageUpload,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
          1
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Template Image</h3>
      </div>
      
      <div>
        <label htmlFor="imageFile" className="cursor-pointer block">
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 hover:bg-blue-100 transition-all duration-300 group">
            <svg className="w-12 h-12 text-blue-500 mx-auto mb-3 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="text-blue-600 font-medium">Upload Image</span>
            <p className="text-xs text-blue-500 mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
        </label>
        <input 
          type="file" 
          id="imageFile" 
          accept="image/*" 
          className="hidden" 
          onChange={onImageUpload}
          disabled={isImageLoading}
        />
      </div>
    </div>
  );
};
