import React from 'react';

interface CanvasPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  templateImage: File | null;
  zoomLevel: number;
  showZoomControls: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToFit: () => void;
  onZoomToActual: () => void;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  canvasRef,
  canvasContainerRef,
  templateImage,
  zoomLevel,
  showZoomControls,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
  onZoomToActual,
}) => {
  return (
    <div className="flex-1 bg-gray-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Preview Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
            {showZoomControls && (
              <>
                <span className="text-xs text-gray-600 ml-4 flex items-center">
                  Hold
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="3" width="14" height="18" rx="4" fill="#F3F4F6" stroke="#6B7280" strokeWidth="1.5"/>
                    <rect x="11" y="5" width="2" height="4" rx="1" fill="#6B7280"/>
                  </svg>
                  <span className="mx-1 px-1 bg-gray-100 text-gray-700 rounded">mouse middle button</span>
                  and drag to pan
                </span>
                <div className="flex items-center space-x-3">
                  <button onClick={onZoomOut} title="Zoom Out (Ctrl+-)" className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors border border-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                    </svg>
                  </button>
                  <span className="text-gray-700 text-sm font-medium min-w-[60px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button onClick={onZoomIn} title="Zoom In (Ctrl++)" className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors border border-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                  <button onClick={onZoomToFit} title="Zoom to Fit (Ctrl+0)" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-xs border border-gray-300">
                    Fit
                  </button>
                  <button onClick={onZoomToActual} title="Actual Size (Ctrl+1)" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-xs border border-gray-300">
                    1:1
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Preview Content */}
        <div className="flex-1 p-6 overflow-auto">
          {templateImage ? (
            <div 
              ref={canvasContainerRef}
              className="h-full w-full bg-white border border-gray-200 rounded-lg shadow-md
                overflow-hidden [&::-webkit-scrollbar]:hidden
                [scrollbar-width:none] [-ms-overflow-style:none]"
            >
              <div className="flex items-center justify-center min-h-full min-w-full p-8">
                <div 
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center'
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    className="cursor-crosshair rounded-lg shadow-lg max-w-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="text-xl font-medium text-gray-700">Upload an image to start</p>
                <p className="text-sm text-gray-600 mt-2">Your template will appear here for editing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
