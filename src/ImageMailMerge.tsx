import React, { useCallback, useEffect } from 'react';
import { QRCodeFieldData, QRCodeFieldEditor, drawQRCodeOnCanvas } from './components/QRCodeField';
import { parseMarkdownText, applyTextFormatting, drawFormattedText } from './components/text/textFormatting';
import { COLOR_PRESETS, TEXT_ALIGN_OPTIONS } from './components/ui/constants';
import { 
  createTextField, 
  createQRField, 
  addFieldToList, 
  removeFieldFromList, 
  clearAllFields,
  updateTextField,
  updateQRField,
  updateField,
  getFieldDisplayText,
  updateFieldMapping,
  clearFieldMappings,
  getUnmappedFields,
  checkReadyToGenerate,
  updateFileNameMapping,
  updateFileNameNumbering
} from './components/fields/fieldManagement';
import { createZoomControls, createFullscreenControls } from './components/canvas/zoomControls';
import { generateImages as generateImagesUtil } from './components/generation/imageGeneration';

// Import hooks
import { useCanvasState, useFontManagement, useFieldState, useSpreadsheetData, useUIState } from './hooks';

// Import components
import { Sidebar } from './components/sections/Sidebar';
import { CanvasPreview } from './components/sections/CanvasPreview';
import { FieldTypeModal } from './components/sections/FieldTypeModal';
import { SuccessNotification } from './components/sections/SuccessNotification';

const ImageMailMerge: React.FC = () => {
  // Canvas state
  const canvas = useCanvasState();
  
  // Font management
  const fonts = useFontManagement();
  
  // Field state
  const fieldState = useFieldState();
  
  // Spreadsheet data
  const spreadsheet = useSpreadsheetData(fieldState.fields);
  
  // UI state
  const ui = useUIState();

  // Initialize canvas context
  useEffect(() => {
    console.log('Initializing canvas context...');
    if (canvas.canvasRef.current && !canvas.ctxRef.current) {
      const ctx = canvas.canvasRef.current.getContext('2d');
      canvas.ctxRef.current = ctx;
      console.log('Canvas context initialized:', ctx ? 'success' : 'failed');
    }
  }, []);

  // Display image preview
  const displayImagePreview = useCallback((imageUrl: string, file: File) => {
    console.log('Starting image preview with URL:', imageUrl);
    const img = new Image();
    img.onload = () => {
      console.log('Image loaded successfully:', img.width, 'x', img.height);
      canvas.originalImageWidthRef.current = img.width;
      canvas.originalImageHeightRef.current = img.height;
      canvas.imageRef.current = img;
      
      if (canvas.canvasRef.current) {
        if (!canvas.ctxRef.current) {
          canvas.ctxRef.current = canvas.canvasRef.current.getContext('2d');
        }
        
        if (canvas.ctxRef.current) {
          canvas.canvasRef.current.width = img.width;
          canvas.canvasRef.current.height = img.height;
          
          console.log('Canvas size set to:', canvas.canvasRef.current.width, 'x', canvas.canvasRef.current.height);
          
          canvas.ctxRef.current.drawImage(img, 0, 0);
          console.log('Image drawn to canvas');
          
          ui.setShowFieldDefinition(true);
          canvas.setShowZoomControls(true);
          canvas.setIsImageLoading(false);
          
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              zoomToFit();
            });
          });
          
          bindCanvasEvents();
        }
      }
    };
    img.onerror = (error) => {
      console.error('Error loading image:', error);
      alert('Error loading image');
      canvas.setIsImageLoading(false);
    };
    img.src = imageUrl;
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size === 0) {
      alert('Please select an image file');
      return;
    }

    console.log('Image file selected:', file.name, file.size);
    canvas.setIsImageLoading(true);
    canvas.setTemplateImage(file);
    
    if (canvas.imageUrl) {
      URL.revokeObjectURL(canvas.imageUrl);
    }
    
    const url = URL.createObjectURL(file);
    canvas.setImageUrl(url);
    displayImagePreview(url, file);
  }, [canvas.imageUrl, canvas.setTemplateImage, displayImagePreview]);

  // Handle spreadsheet upload
  const handleSpreadsheetUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    spreadsheet.handleSpreadsheetUpload(e, fieldState.setFieldMappings);
  }, [spreadsheet, fieldState.setFieldMappings]);

  // Add field at position
  const addFieldAtPosition = useCallback((x: number, y: number) => {
    ui.setPendingFieldPosition({ x, y });
    ui.setShowFieldTypeModal(true);
  }, []);

  // Handle field type selection
  const handleFieldTypeSelection = useCallback((fieldType: 'text' | 'qrcode') => {
    if (!ui.pendingFieldPosition) return;
    
    const fieldName = prompt('Enter field name:');
    if (!fieldName) {
      ui.setShowFieldTypeModal(false);
      ui.setPendingFieldPosition(null);
      return;
    }

    if (fieldType === 'text') {
      const field = createTextField(fieldName, ui.pendingFieldPosition.x, ui.pendingFieldPosition.y);
      addFieldToList(field, fieldState.setFields, fieldState.setFieldMappings);
    } else {
      const field = createQRField(fieldName, ui.pendingFieldPosition.x, ui.pendingFieldPosition.y);
      addFieldToList(field, fieldState.setFields, fieldState.setFieldMappings);
    }

    drawFields();
    checkReadyToGenerate(canvas.templateImage, spreadsheet.csvData, fieldState.fields);
    ui.setShowFieldTypeModal(false);
    ui.setPendingFieldPosition(null);
  }, [ui.pendingFieldPosition]);

  // Draw fields
  const drawFields = useCallback(async () => {
    if (!canvas.canvasRef.current || !canvas.ctxRef.current || !canvas.imageRef.current) return;

    const ctx = canvas.ctxRef.current;
    const img = canvas.imageRef.current;
    
    ctx.clearRect(0, 0, canvas.canvasRef.current.width, canvas.canvasRef.current.height);
    ctx.drawImage(img, 0, 0);

    for (let index = 0; index < fieldState.fields.length; index++) {
      const field = fieldState.fields[index];
      
      if (field.type === 'text') {
        const displayText = getFieldDisplayText(field, spreadsheet.csvData, spreadsheet.currentCsvRowIndex, fieldState.fieldMappings);
        
        if (displayText && displayText.trim()) {
          drawFormattedText(
            ctx,
            displayText,
            field.x,
            field.y,
            field.fontSize,
            field.fontFamily || 'Arial, sans-serif',
            field.color,
            field.textAlign
          );
        } else {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(field.x, field.y, 8, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(field.x, field.y, 4, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = '#1f2937';
          ctx.font = 'bold 12px Arial';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${index + 1}`, field.x + 12, field.y - 8);
          
          ctx.fillStyle = '#1f2937';
          ctx.font = '12px Arial';
          ctx.textBaseline = 'middle';
          ctx.fillText(field.name, field.x + 12, field.y + 6);
        }

        if (index === fieldState.selectedFieldIndex) {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          if (displayText && displayText.trim()) {
            const segments = parseMarkdownText(displayText);
            let totalWidth = 0;
            
            segments.forEach(segment => {
              applyTextFormatting(ctx, segment.formats, field.fontFamily || 'Arial, sans-serif', field.fontSize);
              totalWidth += ctx.measureText(segment.text).width;
            });
            
            let textStartX = field.x;
            if (field.textAlign === 'center') {
              textStartX = field.x - totalWidth / 2;
            } else if (field.textAlign === 'right') {
              textStartX = field.x - totalWidth;
            }
            
            ctx.strokeRect(
              textStartX - 2, 
              field.y - 2, 
              totalWidth + 4, 
              field.fontSize + 4
            );
          } else {
            ctx.strokeRect(field.x - 10, field.y - 10, 20, 20);
          }
        }
      } else if (field.type === 'qrcode') {
        const displayText = getFieldDisplayText(field, spreadsheet.csvData, spreadsheet.currentCsvRowIndex, fieldState.fieldMappings);
        
        if (displayText && displayText.trim()) {
          await drawQRCodeOnCanvas(ctx, field, displayText);
        } else {
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(field.x, field.y, field.size, field.size);
          ctx.strokeStyle = '#d1d5db';
          ctx.lineWidth = 1;
          ctx.strokeRect(field.x, field.y, field.size, field.size);
          
          ctx.fillStyle = '#6b7280';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('QR', field.x + field.size / 2, field.y + field.size / 2);
          
          ctx.fillStyle = '#1f2937';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${index + 1}`, field.x + field.size + 8, field.y + 8);
          
          ctx.font = '12px Arial';
          ctx.fillText(field.name, field.x + field.size + 8, field.y + 24);
        }

        if (index === fieldState.selectedFieldIndex) {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.strokeRect(field.x - 2, field.y - 2, field.size + 4, field.size + 4);
        }
      }
    }
  }, [fieldState.fields, fieldState.selectedFieldIndex, spreadsheet.csvData, spreadsheet.currentCsvRowIndex, fieldState.fieldMappings, canvas]);

  // Get canvas coordinates
  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
    if (!canvas.canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvas.canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.zoomLevel - canvas.canvasOffsetX;
    const y = (e.clientY - rect.top) / canvas.zoomLevel - canvas.canvasOffsetY;
    return { x, y };
  }, [canvas.zoomLevel, canvas.canvasOffsetX, canvas.canvasOffsetY]);

  // Get field at position
  const getFieldAtPosition = useCallback((x: number, y: number): { index: number, isResizeHandle: boolean } => {
    if (!canvas.ctxRef.current) return { index: -1, isResizeHandle: false };

    for (let i = fieldState.fields.length - 1; i >= 0; i--) {
      const field = fieldState.fields[i];
      const displayText = getFieldDisplayText(field, spreadsheet.csvData, spreadsheet.currentCsvRowIndex, fieldState.fieldMappings);
      
      if (field.type === 'text') {
        if (displayText && displayText.trim()) {
          const segments = parseMarkdownText(displayText);
          let totalWidth = 0;
          
          segments.forEach(segment => {
            applyTextFormatting(canvas.ctxRef.current!, segment.formats, field.fontFamily || 'Arial, sans-serif', field.fontSize);
            totalWidth += canvas.ctxRef.current!.measureText(segment.text).width;
          });
          
          let textStartX = field.x;
          if (field.textAlign === 'center') {
            textStartX = field.x - totalWidth / 2;
          } else if (field.textAlign === 'right') {
            textStartX = field.x - totalWidth;
          }
          
          if (x >= textStartX && x <= textStartX + totalWidth &&
              y >= field.y && y <= field.y + field.fontSize) {
            return { index: i, isResizeHandle: false };
          }
        } else {
          const distance = Math.sqrt((x - field.x) ** 2 + (y - field.y) ** 2);
          if (distance <= 8) {
            return { index: i, isResizeHandle: false };
          }
        }
      } else if (field.type === 'qrcode') {
        if (x >= field.x && x <= field.x + field.size &&
            y >= field.y && y <= field.y + field.size) {
          return { index: i, isResizeHandle: false };
        }
      }
    }
    return { index: -1, isResizeHandle: false };
  }, [fieldState.fields, spreadsheet.csvData, spreadsheet.currentCsvRowIndex, fieldState.fieldMappings, canvas]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvas.canvasRef.current) return;
    
    if (e.button === 1) {
      e.preventDefault();
      canvas.setIsPanning(true);
      canvas.panStartRef.current = { x: e.clientX, y: e.clientY };
      if (canvas.canvasContainerRef.current) {
        canvas.canvasContainerRef.current.style.cursor = 'grabbing';
      }
      return;
    }
    
    if (e.button !== 0) return;
    
    const coords = getCanvasCoordinates(e);
    const hit = getFieldAtPosition(coords.x, coords.y);
    
    if (hit.index >= 0) {
      fieldState.setSelectedFieldIndex(hit.index);
      const field = fieldState.fields[hit.index];
      
      if (hit.isResizeHandle) {
        fieldState.setIsResizing(true);
        fieldState.dragStartRef.x = coords.x;
        fieldState.dragStartRef.y = coords.y;
        fieldState.dragStartRef.fieldX = field.x;
        fieldState.dragStartRef.fieldY = field.y;
        fieldState.dragStartRef.fontSize = field.type === 'text' ? field.fontSize : field.size;
        canvas.canvasRef.current.style.cursor = 'nw-resize';
      } else {
        fieldState.setIsDragging(true);
        fieldState.dragStartRef.x = coords.x;
        fieldState.dragStartRef.y = coords.y;
        fieldState.dragStartRef.fieldX = field.x;
        fieldState.dragStartRef.fieldY = field.y;
        fieldState.dragStartRef.fontSize = field.type === 'text' ? field.fontSize : field.size;
        canvas.canvasRef.current.style.cursor = 'move';
      }
    } else {
      addFieldAtPosition(coords.x, coords.y);
    }
  }, [canvas, fieldState, getCanvasCoordinates, getFieldAtPosition, addFieldAtPosition]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvas.canvasRef.current) return;
    
    if (canvas.isPanning) return;
    
    const coords = getCanvasCoordinates(e);
    
    if (fieldState.isDragging && fieldState.selectedFieldIndex >= 0) {
      const field = fieldState.fields[fieldState.selectedFieldIndex];
      const newX = fieldState.dragStartRef.fieldX + (coords.x - fieldState.dragStartRef.x);
      const newY = fieldState.dragStartRef.fieldY + (coords.y - fieldState.dragStartRef.y);
      
      fieldState.setFields(prev => prev.map((f, i) => 
        i === fieldState.selectedFieldIndex ? { ...f, x: newX, y: newY } : f
      ));
    } else if (fieldState.isResizing && fieldState.selectedFieldIndex >= 0) {
      const field = fieldState.fields[fieldState.selectedFieldIndex];
      const deltaY = coords.y - fieldState.dragStartRef.y;
      const newFontSize = Math.max(8, Math.min(72, fieldState.dragStartRef.fontSize + deltaY * 0.5));
      
      fieldState.setFields(prev => prev.map((f, i) => 
        i === fieldState.selectedFieldIndex ? { ...f, fontSize: newFontSize } : f
      ));
    } else {
      const hit = getFieldAtPosition(coords.x, coords.y);
      if (hit.index >= 0) {
        canvas.canvasRef.current.style.cursor = hit.isResizeHandle ? 'nw-resize' : 'move';
      } else {
        canvas.canvasRef.current.style.cursor = 'crosshair';
      }
    }
  }, [canvas.isPanning, fieldState, getCanvasCoordinates, getFieldAtPosition]);

  // Handle mouse up
  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1 && canvas.isPanning) {
      canvas.setIsPanning(false);
      if (canvas.canvasContainerRef.current) {
        canvas.canvasContainerRef.current.style.cursor = '';
      }
      return;
    }
    
    fieldState.setIsDragging(false);
    fieldState.setIsResizing(false);
    if (canvas.canvasRef.current) {
      canvas.canvasRef.current.style.cursor = 'crosshair';
    }
  }, [canvas.isPanning, fieldState]);

  // Handle wheel for resizing
  const handleWheelNative = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (!canvas.canvasRef.current) return;
    
    const coords = getCanvasCoordinates(e as any);
    const hit = getFieldAtPosition(coords.x, coords.y);
    
    if (hit.index >= 0) {
      const field = fieldState.fields[hit.index];
      const delta = e.deltaY > 0 ? -2 : 2;
      
      if (field.type === 'text') {
        const newFontSize = Math.max(8, Math.min(72, field.fontSize + delta));
        fieldState.setFields(prev => prev.map((f, i) => 
          i === hit.index ? { ...f, fontSize: newFontSize } : f
        ));
      } else if (field.type === 'qrcode') {
        const newSize = Math.max(20, Math.min(200, field.size + delta));
        fieldState.setFields(prev => prev.map((f, i) => 
          i === hit.index ? { ...f, size: newSize } : f
        ));
      }
    }
  }, [fieldState.fields, getCanvasCoordinates, getFieldAtPosition, fieldState]);

  // Bind wheel events
  useEffect(() => {
    const canvasEl = canvas.canvasRef.current;
    const container = canvas.canvasContainerRef.current;
    
    if (!canvasEl || !container) return;
    
    const containerWheelHandler = (e: WheelEvent) => {
      e.preventDefault();
    };
    
    canvasEl.addEventListener('wheel', handleWheelNative, { passive: false });
    container.addEventListener('wheel', containerWheelHandler, { passive: false });
    
    return () => {
      canvasEl.removeEventListener('wheel', handleWheelNative);
      container.removeEventListener('wheel', containerWheelHandler);
    };
  }, [handleWheelNative, ui]);

  // Global mouse events for panning
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (canvas.isPanning && canvas.canvasContainerRef.current) {
        const deltaX = e.clientX - canvas.panStartRef.current.x;
        const deltaY = e.clientY - canvas.panStartRef.current.y;
        
        canvas.canvasContainerRef.current.scrollLeft -= deltaX;
        canvas.canvasContainerRef.current.scrollTop -= deltaY;
        
        canvas.panStartRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (e.button === 1 && canvas.isPanning) {
        canvas.setIsPanning(false);
        if (canvas.canvasContainerRef.current) {
          canvas.canvasContainerRef.current.style.cursor = '';
        }
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [canvas.isPanning]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvas.canvasRef.current) return;

      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        canvas.setZoomLevel(prev => Math.min(prev * 1.2, 5));
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        canvas.setZoomLevel(prev => Math.max(prev / 1.2, 0.1));
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        zoomToFit();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        canvas.setZoomLevel(1);
      }
      
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
      
      if (e.key === 'Escape' && fonts.showFontDropdown !== -1) {
        e.preventDefault();
        fonts.closeFontDropdown();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fonts.showFontDropdown]);

  // Click outside handler for font dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fonts.showFontDropdown !== -1) {
        const target = e.target as Element;
        if (!target.closest('.font-dropdown') && !target.closest('.font-dropdown-trigger')) {
          fonts.closeFontDropdown();
        }
      }
    };

    if (fonts.showFontDropdown !== -1) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fonts.showFontDropdown]);

  // Redraw canvas when fields change
  useEffect(() => {
    if (canvas.templateImage && canvas.imageRef.current && canvas.canvasRef.current && canvas.ctxRef.current) {
      drawFields();
    }
  }, [fieldState.fields, fieldState.selectedFieldIndex, canvas.templateImage, drawFields]);

  // Create zoom controls
  const { zoomIn, zoomOut, zoomToFit: zoomToFitFn, zoomToActual } = createZoomControls(
    canvas.setZoomLevel,
    canvas.canvasRef,
    canvas.canvasContainerRef,
    canvas.originalImageWidthRef,
    canvas.originalImageHeightRef
  );

  const zoomToFit = useCallback(() => {
    zoomToFitFn();
  }, [zoomToFitFn]);

  // Create fullscreen controls
  const { toggleFullscreen: toggleFullscreenUtil, setupFullscreenListeners } = createFullscreenControls(
    ui.setIsFullscreen,
    ui.mainLayoutRef
  );

  const toggleFullscreen = useCallback(() => {
    toggleFullscreenUtil(ui.isFullscreen);
  }, [ui.isFullscreen, toggleFullscreenUtil]);

  // Setup fullscreen listeners
  useEffect(() => {
    return setupFullscreenListeners(ui.setIsFullscreen);
  }, [setupFullscreenListeners]);

  // Bind canvas events
  const bindCanvasEvents = useCallback(() => {
    console.log('Canvas events bound');
  }, []);

  // Generate images
  const generateImages = useCallback(async () => {
    if (!canvas.templateImage || !spreadsheet.csvData || !fieldState.fields.length) return;

    ui.setIsProcessing(true);
    ui.setProgress(0);
    ui.setProgressText('Starting image generation...');
    ui.setShowSuccessMessage(false);

    try {
      const result = await generateImagesUtil(
        canvas.templateImage,
        canvas.imageUrl,
        spreadsheet.csvData,
        fieldState.fields,
        fieldState.fieldMappings,
        spreadsheet.fileNameMapping,
        (progress: number, text: string) => {
          ui.setProgress(progress);
          ui.setProgressText(text);
        }
      );

      if (result.success) {
        ui.setShowSuccessMessage(true);
        setTimeout(() => ui.setShowSuccessMessage(false), 5000);
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error generating images:', error);
      alert(`Error generating images: ${(error as Error).message}`);
    } finally {
      ui.setIsProcessing(false);
      ui.setProgress(0);
      ui.setProgressText('');
    }
  }, [canvas.templateImage, spreadsheet.csvData, fieldState.fields, fieldState.fieldMappings, spreadsheet.fileNameMapping, canvas.imageUrl, ui]);

  const isReadyToGenerate = checkReadyToGenerate(canvas.templateImage, spreadsheet.csvData, fieldState.fields);

  return (
    <>
      {/* Success Notification */}
      <SuccessNotification
        show={ui.showSuccessMessage}
        imagesCount={spreadsheet.csvData?.length || 0}
      />

      {/* Main Layout */}
      <div ref={ui.mainLayoutRef} className="flex h-full min-h-0 bg-white">
        {/* Sidebar */}
        <Sidebar
          sidebarWidth={ui.sidebarWidth}
          isFullscreen={ui.isFullscreen}
          templateImage={canvas.templateImage}
          csvData={spreadsheet.csvData}
          csvHeaders={spreadsheet.csvHeaders}
          fields={fieldState.fields}
          fieldMappings={fieldState.fieldMappings}
          fileNameMapping={spreadsheet.fileNameMapping}
          currentCsvRowIndex={spreadsheet.currentCsvRowIndex}
          selectedFieldIndex={fieldState.selectedFieldIndex}
          showFieldDefinition={ui.showFieldDefinition}
          isImageLoading={canvas.isImageLoading}
          isProcessing={ui.isProcessing}
          progress={ui.progress}
          progressText={ui.progressText}
          showZoomControls={canvas.showZoomControls}
          isFontsLoading={fonts.isFontsLoading}
          fontsLoaded={fonts.fontsLoaded}
          availableFonts={fonts.availableFonts}
          showFontDropdown={fonts.showFontDropdown}
          fontSearchTerm={fonts.fontSearchTerm}
          fontDetectionMethod={fonts.fontDetectionMethod}
          filteredFonts={fonts.filteredFonts}
          onToggleFullscreen={toggleFullscreen}
          onImageUpload={handleImageUpload}
          onSpreadsheetUpload={handleSpreadsheetUpload}
          onFieldNameChange={(index, name) => updateField(index, 'name', name, fieldState.setFields, fieldState.setFieldMappings)}
          onFieldDemoTextChange={(index, text) => updateField(index, 'demoText', text, fieldState.setFields, fieldState.setFieldMappings)}
          onFieldFontSizeChange={(index, size) => updateTextField(index, 'fontSize', size, fieldState.setFields, fieldState.setFieldMappings)}
          onFieldFontChange={(index, font) => updateTextField(index, 'fontFamily', font, fieldState.setFields, fieldState.setFieldMappings)}
          onFieldColorChange={(index, color) => updateField(index, 'color', color, fieldState.setFields, fieldState.setFieldMappings)}
          onFieldAlignmentChange={(index, align) => updateTextField(index, 'textAlign', align, fieldState.setFields, fieldState.setFieldMappings)}
          onFieldSelect={(index) => fieldState.setSelectedFieldIndex(index)}
          onFieldRemove={(index) => fieldState.handleRemoveField(index)}
          onClearAllFields={() => {
            clearAllFields(fieldState.setFields, fieldState.setFieldMappings);
            fieldState.setSelectedFieldIndex(-1);
          }}
          onToggleFontDropdown={(index) => fonts.toggleFontDropdown(index)}
          onFontSearchChange={(term) => fonts.setFontSearchTerm(term)}
          onCloseFontDropdown={() => fonts.closeFontDropdown()}
          onFieldUpdate={(index, field) => fieldState.setFields(prev => prev.map((f, i) => i === index ? field : f))}
          onPreviousRow={() => spreadsheet.goToPreviousRow()}
          onNextRow={() => spreadsheet.goToNextRow()}
          onFieldMappingChange={(fieldName, csvColumn) => updateFieldMapping(fieldName, csvColumn, fieldState.setFieldMappings)}
          onFileNameMappingChange={(csvColumn) => updateFileNameMapping(csvColumn, spreadsheet.setFileNameMapping)}
          onFileNameNumberingChange={(includeNumbering) => updateFileNameNumbering(includeNumbering, spreadsheet.setFileNameMapping)}
          onClearAllMappings={() => {
            clearFieldMappings(fieldState.fields, fieldState.setFieldMappings);
            spreadsheet.setFileNameMapping({ csvColumn: null, includeNumbering: true });
          }}
          onGenerateImages={generateImages}
          getCurrentRowData={() => spreadsheet.getCurrentRowData()}
          isReadyToGenerate={isReadyToGenerate}
          onSidebarResizeStart={ui.handleSidebarResizeStart}
        />

        {/* Resize Handle */}
        <div 
          className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors"
          onMouseDown={ui.handleSidebarResizeStart}
        />

        {/* Main Preview Area */}
        <CanvasPreview
          canvasRef={canvas.canvasRef}
          canvasContainerRef={canvas.canvasContainerRef}
          templateImage={canvas.templateImage}
          zoomLevel={canvas.zoomLevel}
          showZoomControls={canvas.showZoomControls}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onZoomToFit={zoomToFit}
          onZoomToActual={zoomToActual}
        />
      </div>

      {/* Field Type Selection Modal */}
      <FieldTypeModal
        isOpen={ui.showFieldTypeModal}
        onTextFieldSelect={() => handleFieldTypeSelection('text')}
        onQRCodeFieldSelect={() => handleFieldTypeSelection('qrcode')}
        onCancel={() => {
          ui.setShowFieldTypeModal(false);
          ui.setPendingFieldPosition(null);
        }}
      />
    </>
  );
};

export default ImageMailMerge;
