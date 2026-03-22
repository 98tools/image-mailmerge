import React from 'react';

interface FieldTypeModalProps {
  isOpen: boolean;
  onTextFieldSelect: () => void;
  onQRCodeFieldSelect: () => void;
  onCancel: () => void;
}

export const FieldTypeModal: React.FC<FieldTypeModalProps> = ({
  isOpen,
  onTextFieldSelect,
  onQRCodeFieldSelect,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw shadow-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Field Type</h3>
        <div className="space-y-3">
          <button
            onClick={onTextFieldSelect}
            className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-left transition-colors shadow-md hover:shadow-lg"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              <div>
                <div className="font-medium">Text Field</div>
                <div className="text-sm text-blue-200">Regular text with formatting options</div>
              </div>
            </div>
          </button>
          <button
            onClick={onQRCodeFieldSelect}
            className="w-full p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white text-left transition-colors shadow-md hover:shadow-lg"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              <div>
                <div className="font-medium">QR Code Field</div>
                <div className="text-sm text-green-200">Generate QR codes from spreadsheet data</div>
              </div>
            </div>
          </button>
        </div>
        <button
          onClick={onCancel}
          className="w-full mt-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors border border-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
