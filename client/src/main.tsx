import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.addEventListener('DOMContentLoaded', () => {
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  meta.content = '#4f46e5'; // Primary color for theme
  document.head.appendChild(meta);
  
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
});

createRoot(document.getElementById("root")!).render(<App />);
