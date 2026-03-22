import { useState, useRef, useCallback, useEffect } from 'react';

export const useUIState = () => {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFieldDefinition, setShowFieldDefinition] = useState(false);
  const [showFieldTypeModal, setShowFieldTypeModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [pendingFieldPosition, setPendingFieldPosition] = useState<{x: number, y: number} | null>(null);

  const mainLayoutRef = useRef<HTMLDivElement>(null);
  const sidebarResizeStartRef = useRef({ width: 0, x: 0 });

  const handleSidebarResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingSidebar(true);
    sidebarResizeStartRef.current = { width: sidebarWidth, x: e.clientX };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  useEffect(() => {
    const handleSidebarResizeMove = (e: MouseEvent) => {
      if (!isResizingSidebar) return;
      
      const deltaX = e.clientX - sidebarResizeStartRef.current.x;
      const newWidth = sidebarResizeStartRef.current.width + deltaX;
      
      const minWidth = 300;
      const maxWidth = Math.min(600, window.innerWidth * 0.5);
      const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      
      setSidebarWidth(constrainedWidth);
    };

    const handleSidebarResizeEnd = () => {
      if (isResizingSidebar) {
        setIsResizingSidebar(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    if (isResizingSidebar) {
      document.addEventListener('mousemove', handleSidebarResizeMove);
      document.addEventListener('mouseup', handleSidebarResizeEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleSidebarResizeMove);
      document.removeEventListener('mouseup', handleSidebarResizeEnd);
    };
  }, [isResizingSidebar]);

  return {
    sidebarWidth,
    setSidebarWidth,
    isResizingSidebar,
    setIsResizingSidebar,
    isFullscreen,
    setIsFullscreen,
    showFieldDefinition,
    setShowFieldDefinition,
    showFieldTypeModal,
    setShowFieldTypeModal,
    showSuccessMessage,
    setShowSuccessMessage,
    isProcessing,
    setIsProcessing,
    progress,
    setProgress,
    progressText,
    setProgressText,
    pendingFieldPosition,
    setPendingFieldPosition,
    mainLayoutRef,
    sidebarResizeStartRef,
    handleSidebarResizeStart,
  };
};
