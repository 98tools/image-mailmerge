import { useState, useCallback } from 'react';
import { Field, FieldMapping } from '../components/types/fieldTypes';

export const useFieldState = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragStartRef = { x: 0, y: 0, fieldX: 0, fieldY: 0, fontSize: 0 };

  const handleRemoveField = useCallback((index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
    const newMappings = fieldMappings.filter(m => m.fieldName !== fields[index].name);
    setFieldMappings(newMappings);
    
    if (selectedFieldIndex === index) {
      setSelectedFieldIndex(-1);
    } else if (selectedFieldIndex > index) {
      setSelectedFieldIndex(prev => prev - 1);
    }
  }, [fields, fieldMappings, selectedFieldIndex]);

  const handleClearFields = useCallback(() => {
    setFields([]);
    setFieldMappings([]);
    setSelectedFieldIndex(-1);
  }, []);

  return {
    fields,
    setFields,
    fieldMappings,
    setFieldMappings,
    selectedFieldIndex,
    setSelectedFieldIndex,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    dragStartRef,
    handleRemoveField,
    handleClearFields,
  };
};
