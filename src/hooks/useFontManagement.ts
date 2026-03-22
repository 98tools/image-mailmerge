import { useState, useCallback, useMemo } from 'react';
import { detectSystemFonts, updateFontFamilyOptions, type FontOption } from '../components/font/fontFunctions';
import { DEFAULT_FONT_OPTIONS } from '../components/font/fontsList';

export const useFontManagement = () => {
  const [availableFonts, setAvailableFonts] = useState<FontOption[]>(DEFAULT_FONT_OPTIONS);
  const [isFontsLoading, setIsFontsLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontSearchTerm, setFontSearchTerm] = useState('');
  const [showFontDropdown, setShowFontDropdown] = useState(-1);
  const [fontDetectionMethod, setFontDetectionMethod] = useState<'api' | 'fallback' | 'none'>('none');

  const loadFontsLazily = useCallback(async () => {
    if (fontsLoaded || isFontsLoading) {
      return;
    }
    
    setIsFontsLoading(true);
    try {
      console.log('Detecting system fonts...');
      const detectedFonts = await detectSystemFonts();
      console.log(`Detected ${detectedFonts.length} system fonts`);
      
      if (detectedFonts.length > 50) {
        setFontDetectionMethod('api');
      } else if (detectedFonts.length > 0) {
        setFontDetectionMethod('fallback');
      } else {
        setFontDetectionMethod('none');
      }
      
      const combinedFonts = [...DEFAULT_FONT_OPTIONS];
      
      detectedFonts.forEach(font => {
        if (!combinedFonts.find(existing => existing.name === font.name)) {
          combinedFonts.push(font);
        }
      });
      
      combinedFonts.sort((a, b) => a.name.localeCompare(b.name));
      
      setAvailableFonts(combinedFonts);
      updateFontFamilyOptions(combinedFonts);
      setFontsLoaded(true);
      console.log(`Total fonts available: ${combinedFonts.length}`);
    } catch (error) {
      console.error('Error detecting fonts:', error);
      setAvailableFonts(DEFAULT_FONT_OPTIONS);
      setFontDetectionMethod('none');
    } finally {
      setIsFontsLoading(false);
    }
  }, [fontsLoaded, isFontsLoading]);

  const filteredFonts = useMemo(() => {
    if (!fontSearchTerm) return availableFonts;
    return availableFonts.filter(font => 
      font.name.toLowerCase().includes(fontSearchTerm.toLowerCase())
    );
  }, [availableFonts, fontSearchTerm]);

  const getFontDropdownForField = useCallback((fieldIndex: number) => {
    return showFontDropdown === fieldIndex;
  }, [showFontDropdown]);

  const toggleFontDropdown = useCallback((fieldIndex: number) => {
    if (showFontDropdown !== fieldIndex) {
      loadFontsLazily();
    }
    
    setShowFontDropdown(prev => prev === fieldIndex ? -1 : fieldIndex);
    setFontSearchTerm('');
  }, [showFontDropdown, loadFontsLazily]);

  const closeFontDropdown = useCallback(() => {
    setShowFontDropdown(-1);
    setFontSearchTerm('');
  }, []);

  return {
    availableFonts,
    isFontsLoading,
    fontsLoaded,
    fontSearchTerm,
    setFontSearchTerm,
    showFontDropdown,
    fontDetectionMethod,
    filteredFonts,
    getFontDropdownForField,
    toggleFontDropdown,
    closeFontDropdown,
    loadFontsLazily,
  };
};
