/**
 * Color Utility Functions for Theme System
 * Provides color conversion, comparison, and validation utilities
 */

/**
 * Convert HEX color to HSL format
 * @param {string} hex - HEX color value (e.g., "#8B5CF6" or "#8B5")
 * @returns {{h: number, s: number, l: number}} HSL values (h: 0-360, s: 0-100, l: 0-100)
 */
function hexToHsl(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Handle 3-digit HEX format
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / delta + 2) * 60;
        break;
      case b:
        h = ((r - g) / delta + 4) * 60;
        break;
    }
  }
  
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Calculate hue difference between two colors
 * @param {string} color1 - First HEX color
 * @param {string} color2 - Second HEX color
 * @returns {number} Hue difference in degrees (0-180)
 */
function getHueDifference(color1, color2) {
  const hsl1 = hexToHsl(color1);
  const hsl2 = hexToHsl(color2);
  
  // Calculate the absolute difference
  let diff = Math.abs(hsl1.h - hsl2.h);
  
  // Hue is circular (0-360), so we need the shortest distance
  // The maximum meaningful difference is 180 degrees
  if (diff > 180) {
    diff = 360 - diff;
  }
  
  return diff;
}

/**
 * Convert HEX color to RGB values
 * @param {string} hex - HEX color value
 * @returns {{r: number, g: number, b: number}} RGB values (0-255)
 */
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 formula
 * @param {string} hex - HEX color value
 * @returns {number} Relative luminance (0-1)
 */
function getRelativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  
  // Convert to sRGB
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;
  
  // Apply gamma correction
  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate WCAG contrast ratio between two colors
 * @param {string} foreground - Foreground HEX color
 * @param {string} background - Background HEX color
 * @returns {number} Contrast ratio (1-21)
 */
function getContrastRatio(foreground, background) {
  const lum1 = getRelativeLuminance(foreground);
  const lum2 = getRelativeLuminance(background);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standard
 * @param {number} ratio - Contrast ratio
 * @returns {boolean} True if meets WCAG AA (>= 4.5)
 */
function meetsWcagAA(ratio) {
  return ratio >= 4.5;
}

/**
 * Validate HEX color format
 * @param {string} color - Color value to validate
 * @returns {boolean} True if valid HEX color
 */
function isValidHexColor(color) {
  if (typeof color !== 'string') return false;
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Validate CSS gradient format
 * @param {string} gradient - Gradient value to validate
 * @returns {boolean} True if valid CSS gradient
 */
function isValidGradient(gradient) {
  if (typeof gradient !== 'string') return false;
  // Check for linear-gradient or radial-gradient pattern
  const gradientRegex = /^(linear|radial)-gradient\s*\(/i;
  return gradientRegex.test(gradient);
}

/**
 * Validate RGB string format (e.g., "139, 92, 246")
 * @param {string} rgbString - RGB string to validate
 * @returns {boolean} True if valid RGB string
 */
function isValidRgbString(rgbString) {
  if (typeof rgbString !== 'string') return false;
  const rgbRegex = /^\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*$/;
  if (!rgbRegex.test(rgbString)) return false;
  
  // Validate each component is 0-255
  const parts = rgbString.split(',').map(p => parseInt(p.trim(), 10));
  return parts.every(p => p >= 0 && p <= 255);
}

/**
 * Validate theme configuration completeness and correctness
 * @param {Object} theme - Theme configuration object
 * @returns {{valid: boolean, errors: string[]}} Validation result with errors
 */
function validateThemeConfig(theme) {
  const errors = [];
  
  if (!theme || typeof theme !== 'object') {
    return { valid: false, errors: ['Theme must be a non-null object'] };
  }
  
  // Required string field
  const requiredStringFields = ['name'];
  
  // Required HEX color fields
  const requiredHexFields = [
    'primary', 'primaryLight', 'secondary', 'accent',
    'glowColor1', 'glowColor2', 'glowColor3',
    'bgColor1', 'bgColor2', 'bgColor3'
  ];
  
  // Required RGB string fields
  const requiredRgbFields = [
    'primaryRgb', 'secondaryRgb', 'accentRgb'
  ];
  
  // Required gradient fields
  const requiredGradientFields = [
    'gradient', 'bgGradient', 'navGradient', 
    'sectionGradient1', 'sectionGradient2'
  ];
  
  // Check required string fields
  for (const field of requiredStringFields) {
    if (!theme[field] || typeof theme[field] !== 'string' || theme[field].trim() === '') {
      errors.push(`Missing or invalid required field: ${field}`);
    }
  }
  
  // Check required HEX color fields
  for (const field of requiredHexFields) {
    if (!theme[field]) {
      errors.push(`Missing required field: ${field}`);
    } else if (!isValidHexColor(theme[field])) {
      errors.push(`Invalid HEX color format for field: ${field} (value: ${theme[field]})`);
    }
  }
  
  // Check required RGB string fields
  for (const field of requiredRgbFields) {
    if (!theme[field]) {
      errors.push(`Missing required field: ${field}`);
    } else if (!isValidRgbString(theme[field])) {
      errors.push(`Invalid RGB string format for field: ${field} (value: ${theme[field]})`);
    }
  }
  
  // Check required gradient fields
  for (const field of requiredGradientFields) {
    if (!theme[field]) {
      errors.push(`Missing required field: ${field}`);
    } else if (!isValidGradient(theme[field])) {
      errors.push(`Invalid gradient format for field: ${field} (value: ${theme[field]})`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Sort themes by primary color hue similarity using nearest neighbor algorithm
 * Ensures adjacent themes have hue difference <= 60 degrees when possible
 * @param {Array<{primary: string, [key: string]: any}>} themes - Array of theme objects with primary color
 * @returns {Array} Sorted themes array
 */
function sortThemesByColorSimilarity(themes) {
  if (!themes || themes.length <= 1) {
    return themes ? [...themes] : [];
  }
  
  // Create a copy to avoid mutating the original array
  const remaining = [...themes];
  const sorted = [];
  
  // Start with the first theme (or could pick the one with lowest hue)
  sorted.push(remaining.shift());
  
  // Nearest neighbor algorithm: always pick the closest unvisited theme
  while (remaining.length > 0) {
    const currentTheme = sorted[sorted.length - 1];
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    
    // Find the nearest theme by hue difference
    for (let i = 0; i < remaining.length; i++) {
      const distance = getHueDifference(currentTheme.primary, remaining[i].primary);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }
    
    // Add the nearest theme to sorted array
    sorted.push(remaining.splice(nearestIndex, 1)[0]);
  }
  
  return sorted;
}

// Export for testing (Node.js/ES module environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { hexToHsl, getHueDifference, hexToRgb, getRelativeLuminance, getContrastRatio, meetsWcagAA, sortThemesByColorSimilarity, isValidHexColor, isValidGradient, isValidRgbString, validateThemeConfig };
}

// Make functions available globally for browser usage
if (typeof window !== 'undefined') {
  window.ColorUtils = {
    hexToHsl,
    getHueDifference,
    hexToRgb,
    getRelativeLuminance,
    getContrastRatio,
    meetsWcagAA,
    sortThemesByColorSimilarity,
    isValidHexColor,
    isValidGradient,
    isValidRgbString,
    validateThemeConfig
  };
}

// ES module export
export { hexToHsl, getHueDifference, hexToRgb, getRelativeLuminance, getContrastRatio, meetsWcagAA, sortThemesByColorSimilarity, isValidHexColor, isValidGradient, isValidRgbString, validateThemeConfig };
