import React from 'react';

interface FieldNameModalProps {
  isOpen: boolean;
  fieldName: string;
  fieldType: 'text' | 'qrcode' | null;
  onFieldNameChange: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const FieldNameModal: React.FC<FieldNameModalProps> = ({
  isOpen,
  fieldName,
  fieldType,
  onFieldNameChange,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw shadow-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter field name</h3>
        {fieldType && (
          <p className="text-sm text-gray-600 mb-4">
            Creating a <span className="font-bold">{fieldType === 'text' ? 'Text Field' : 'QR Code Field'}</span>
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm();
          }}
        >
          <input
            type="text"
            value={fieldName}
            onChange={(e) => onFieldNameChange(e.target.value)}
            placeholder="Field name"
            autoFocus
            className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
