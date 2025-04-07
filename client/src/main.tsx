import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Capacitor } from '@capacitor/core';

// Initialize capacitor elements
defineCustomElements(window);

document.addEventListener('DOMContentLoaded', () => {
  // Meta tags for mobile
  const viewportMeta = document.createElement('meta');
  viewportMeta.name = 'viewport';
  viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
  document.head.appendChild(viewportMeta);
  
  const themeMeta = document.createElement('meta');
  themeMeta.name = 'theme-color';
  themeMeta.content = '#4f46e5'; // Primary color for theme
  document.head.appendChild(themeMeta);
  
  // Set title
  const title = document.createElement('title');
  title.textContent = 'PhishShield AI';
  document.head.appendChild(title);
  
  // Add Inter font
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  document.head.appendChild(fontLink);
  
  // Add Material Icons
  const iconsLink = document.createElement('link');
  iconsLink.rel = 'stylesheet';
  iconsLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  document.head.appendChild(iconsLink);
  
  // Apple specific meta tags
  if (Capacitor.getPlatform() === 'ios') {
    const appleMobileWebAppCapable = document.createElement('meta');
    appleMobileWebAppCapable.name = 'apple-mobile-web-app-capable';
    appleMobileWebAppCapable.content = 'yes';
    document.head.appendChild(appleMobileWebAppCapable);
  
    const appleMobileWebAppStatusBar = document.createElement('meta');
    appleMobileWebAppStatusBar.name = 'apple-mobile-web-app-status-bar-style';
    appleMobileWebAppStatusBar.content = 'black-translucent';
    document.head.appendChild(appleMobileWebAppStatusBar);
  }
});

// SVG Filters for Colorblind Support
const createSVGFilters = () => {
  const svgFilters = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgFilters.setAttribute('width', '0');
  svgFilters.setAttribute('height', '0');
  svgFilters.style.position = 'absolute';
  svgFilters.style.overflow = 'hidden';
  svgFilters.setAttribute('aria-hidden', 'true');
  
  // Hidden SVG container
  svgFilters.innerHTML = `
    <!-- Protanopia (red-blind) filter -->
    <filter id="protanopia-filter">
      <feColorMatrix
        in="SourceGraphic"
        type="matrix"
        values="0.567, 0.433, 0,     0, 0
                0.558, 0.442, 0,     0, 0
                0,     0.242, 0.758, 0, 0
                0,     0,     0,     1, 0"/>
    </filter>
    
    <!-- Deuteranopia (green-blind) filter -->
    <filter id="deuteranopia-filter">
      <feColorMatrix
        in="SourceGraphic"
        type="matrix"
        values="0.625, 0.375, 0,   0, 0
                0.7,   0.3,   0,   0, 0
                0,     0.3,   0.7, 0, 0
                0,     0,     0,   1, 0"/>
    </filter>
    
    <!-- Tritanopia (blue-blind) filter -->
    <filter id="tritanopia-filter">
      <feColorMatrix
        in="SourceGraphic"
        type="matrix"
        values="0.95, 0.05,  0,     0, 0
                0,    0.433, 0.567, 0, 0
                0,    0.475, 0.525, 0, 0
                0,    0,     0,     1, 0"/>
    </filter>
  `;
  
  document.body.appendChild(svgFilters);
};

// Create the SVG filters when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  createSVGFilters();
});

// Init app
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
