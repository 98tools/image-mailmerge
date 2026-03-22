import { useState, useRef, useCallback, useEffect } from 'react';

export const useCanvasState = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const originalImageWidthRef = useRef(0);
  const originalImageHeightRef = useRef(0);
  
  const [templateImage, setTemplateImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [canvasOffsetX, setCanvasOffsetX] = useState(0);
  const [canvasOffsetY, setCanvasOffsetY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [showZoomControls, setShowZoomControls] = useState(false);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Initialize canvas context
  useEffect(() => {
    console.log('Initializing canvas context...');
    if (canvasRef.current && !ctxRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctxRef.current = ctx;
      console.log('Canvas context initialized:', ctx ? 'success' : 'failed');
      if (ctx) {
        canvasRef.current.width = 300;
        canvasRef.current.height = 300;
        console.log('Canvas dimensions set to:', canvasRef.current.width, 'x', canvasRef.current.height);
      }
    }
  }, []);

  // Cleanup image URL on unmount
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return {
    canvasRef,
    ctxRef,
    imageRef,
    originalImageWidthRef,
    originalImageHeightRef,
    templateImage,
    setTemplateImage,
    imageUrl,
    setImageUrl,
    zoomLevel,
    setZoomLevel,
    canvasOffsetX,
    setCanvasOffsetX,
    canvasOffsetY,
    setCanvasOffsetY,
    isPanning,
    setIsPanning,
    isImageLoading,
    setIsImageLoading,
    showZoomControls,
    setShowZoomControls,
    canvasContainerRef,
    panStartRef,
  };
};
