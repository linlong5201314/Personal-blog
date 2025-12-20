/**
 * Unit tests for color utility functions
 */
import { describe, it, expect } from 'vitest';
import { 
  hexToHsl, 
  getHueDifference, 
  sortThemesByColorSimilarity 
} from '../../js/color-utils.js';

describe('sortThemesByColorSimilarity', () => {
  it('should return empty array for empty input', () => {
    expect(sortThemesByColorSimilarity([])).toEqual([]);
  });

  it('should return same array for single theme', () => {
    const themes = [{ name: 'Test', primary: '#FF0000' }];
    expect(sortThemesByColorSimilarity(themes)).toEqual(themes);
  });

  it('should not mutate the original array', () => {
    const themes = [
      { name: 'Red', primary: '#FF0000' },
      { name: 'Blue', primary: '#0000FF' }
    ];
    const original = [...themes];
    sortThemesByColorSimilarity(themes);
    expect(themes).toEqual(original);
  });

  it('should sort themes by hue similarity', () => {
    // Red (0°), Orange (30°), Yellow (60°), Green (120°), Blue (240°)
    const themes = [
      { name: 'Red', primary: '#FF0000' },      // Hue ~0
      { name: 'Blue', primary: '#0000FF' },     // Hue ~240
      { name: 'Green', primary: '#00FF00' },    // Hue ~120
      { name: 'Orange', primary: '#FF8000' },   // Hue ~30
      { name: 'Yellow', primary: '#FFFF00' }    // Hue ~60
    ];
    
    const sorted = sortThemesByColorSimilarity(themes);
    
    // Starting from Red, nearest neighbor should give us a smooth progression
    // Red -> Orange -> Yellow -> Green -> Blue (or similar smooth path)
    expect(sorted[0].name).toBe('Red'); // First element stays the same
    
    // Check that adjacent themes have reasonable hue differences
    for (let i = 0; i < sorted.length - 1; i++) {
      const hueDiff = getHueDifference(sorted[i].primary, sorted[i + 1].primary);
      // With nearest neighbor, we should get relatively small jumps
      expect(hueDiff).toBeLessThanOrEqual(120); // Reasonable threshold for this test set
    }
  });

  it('should handle themes with similar hues', () => {
    const themes = [
      { name: 'Purple1', primary: '#8B5CF6' },  // ~262°
      { name: 'Purple2', primary: '#7C3AED' },  // ~263°
      { name: 'Purple3', primary: '#6366F1' }   // ~239°
    ];
    
    const sorted = sortThemesByColorSimilarity(themes);
    
    // All adjacent pairs should have small hue differences
    for (let i = 0; i < sorted.length - 1; i++) {
      const hueDiff = getHueDifference(sorted[i].primary, sorted[i + 1].primary);
      expect(hueDiff).toBeLessThanOrEqual(60);
    }
  });

  it('should handle null/undefined input gracefully', () => {
    expect(sortThemesByColorSimilarity(null)).toEqual([]);
    expect(sortThemesByColorSimilarity(undefined)).toEqual([]);
  });
});
