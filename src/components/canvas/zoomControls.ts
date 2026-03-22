// Zoom control utilities
export const createZoomControls = (
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  canvasContainerRef: React.RefObject<HTMLDivElement>,
  originalImageWidthRef: React.MutableRefObject<number>,
  originalImageHeightRef: React.MutableRefObject<number>
) => {
  const zoomIn = () => setZoomLevel(prev => Math.min(prev * 1.2, 5));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev / 1.2, 0.1));
  const zoomToActual = () => setZoomLevel(1);

  const centerCanvasInContainer = (scale: number) => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const targetLeft = Math.max((container.scrollWidth - container.clientWidth) / 2, 0);
    const targetTop = Math.max((container.scrollHeight - container.clientHeight) / 2, 0);

    container.scrollLeft = targetLeft;
    container.scrollTop = targetTop;
  };

  const calculateFitScale = () => {
    if (!canvasRef.current || !originalImageWidthRef.current || !originalImageHeightRef.current) {
      return 1;
    }

    const container = canvasContainerRef.current;
    if (!container) return 1;

    const containerRect = container.getBoundingClientRect();
    const padding = 32;
    const availableWidth = Math.max(containerRect.width - padding, 1);
    const availableHeight = Math.max(containerRect.height - padding, 1);

    const scaleX = availableWidth / originalImageWidthRef.current;
    const scaleY = availableHeight / originalImageHeightRef.current;
    return Math.min(scaleX, scaleY, 1);
  };
  
  const zoomToFit = () => {
    const applyFit = () => {
      const scale = calculateFitScale();
      setZoomLevel(scale);
      requestAnimationFrame(() => centerCanvasInContainer(scale));
    };

    applyFit();
    requestAnimationFrame(applyFit);
  };
  
  return {
    zoomIn,
    zoomOut,
    zoomToFit,
    zoomToActual
  };
};

// Fullscreen utilities
export const createFullscreenControls = (
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>,
  mainLayoutRef: React.RefObject<HTMLDivElement>
) => {
  const toggleFullscreen = async (isFullscreen: boolean) => {
    try {
      if (!isFullscreen) {
        // Enter fullscreen on the main layout container
        const element = mainLayoutRef.current;
        if (!element) return;
        
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).msRequestFullscreen) {
          await (element as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.warn('Fullscreen operation failed:', error);
    }
  };

  const setupFullscreenListeners = (setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>) => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  };

  return {
    toggleFullscreen,
    setupFullscreenListeners
  };
};