import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  largeText: boolean;
  toggleLargeText: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  setColorBlindMode: (mode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') => void;
}

const defaultContext: AccessibilityContextType = {
  highContrast: false,
  toggleHighContrast: () => {},
  largeText: false,
  toggleLargeText: () => {},
  reducedMotion: false,
  toggleReducedMotion: () => {},
  colorBlindMode: 'none',
  setColorBlindMode: () => {},
};

export const AccessibilityContext = createContext<AccessibilityContextType>(defaultContext);

export const useAccessibility = () => useContext(AccessibilityContext);

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  // Check localStorage for saved preferences, default to false if not found
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const saved = localStorage.getItem('accessibility_highContrast');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [largeText, setLargeText] = useState<boolean>(() => {
    const saved = localStorage.getItem('accessibility_largeText');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    const saved = localStorage.getItem('accessibility_reducedMotion');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [colorBlindMode, setColorBlindModeState] = useState<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'>(() => {
    const saved = localStorage.getItem('accessibility_colorBlindMode');
    return saved ? JSON.parse(saved) : 'none';
  });

  // Update localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem('accessibility_highContrast', JSON.stringify(highContrast));
    
    // Apply high contrast mode to body
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('accessibility_largeText', JSON.stringify(largeText));
    
    // Apply large text mode to body
    if (largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  }, [largeText]);

  useEffect(() => {
    localStorage.setItem('accessibility_reducedMotion', JSON.stringify(reducedMotion));
    
    // Apply reduced motion preference
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('accessibility_colorBlindMode', JSON.stringify(colorBlindMode));
    
    // Apply color blind mode
    document.body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (colorBlindMode !== 'none') {
      document.body.classList.add(colorBlindMode);
    }
  }, [colorBlindMode]);

  // Toggle functions
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleLargeText = () => setLargeText(prev => !prev);
  const toggleReducedMotion = () => setReducedMotion(prev => !prev);
  const setColorBlindMode = (mode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') => 
    setColorBlindModeState(mode);

  // Context value
  const value = {
    highContrast,
    toggleHighContrast,
    largeText,
    toggleLargeText,
    reducedMotion,
    toggleReducedMotion,
    colorBlindMode,
    setColorBlindMode
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};