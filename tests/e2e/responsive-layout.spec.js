// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * **Feature: personal-website, Property 1: Responsive Layout Consistency**
 * 
 * *For any* viewport width between 320px and 1920px, the Personal_Website layout 
 * SHALL adapt without horizontal overflow and all content SHALL remain accessible and readable.
 * 
 * **Validates: Requirements 1.3**
 */

// Generate unique viewport widths within the valid range (320px - 1920px)
function generateUniqueViewportWidths(count = 100) {
  const widthSet = new Set();
  const minWidth = 320;
  const maxWidth = 1920;
  
  // Always include boundary values
  widthSet.add(minWidth);  // 320px - minimum
  widthSet.add(maxWidth);  // 1920px - maximum
  
  // Include key breakpoints from responsive.css
  widthSet.add(374);   // Edge of extra small screens
  widthSet.add(375);   // Common mobile width
  widthSet.add(767);   // Edge of mobile
  widthSet.add(768);   // Tablet start
  widthSet.add(1023);  // Edge of tablet
  widthSet.add(1024);  // Desktop start
  widthSet.add(1439);  // Edge of desktop
  widthSet.add(1440);  // Large screen start
  
  // Use seeded random for reproducibility
  let seed = 42;
  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  
  // Generate unique random widths for the remaining count
  while (widthSet.size < count) {
    const randomWidth = Math.floor(seededRandom() * (maxWidth - minWidth + 1)) + minWidth;
    widthSet.add(randomWidth);
  }
  
  return Array.from(widthSet).sort((a, b) => a - b);
}

// Property-based test: Run 100 iterations with unique viewport widths
const viewportWidths = generateUniqueViewportWidths(100);

test.describe('Property 1: Responsive Layout Consistency', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const width of viewportWidths) {
    test(`viewport ${width}px - no horizontal overflow and content accessible`, async ({ page }) => {
      // Set viewport size
      await page.setViewportSize({ width: width, height: 800 });
      
      // Navigate to the page
      await page.goto('http://localhost:3000/index.html');
      
      // Wait for page to be fully loaded
      await page.waitForLoadState('domcontentloaded');
      
      // Property 1a: No horizontal overflow
      // Check that the document body doesn't have horizontal scrollbar
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const windowInnerWidth = await page.evaluate(() => window.innerWidth);
      
      expect(bodyScrollWidth).toBeLessThanOrEqual(windowInnerWidth + 1); // +1 for rounding tolerance
      
      // Property 1b: All main sections are visible and accessible
      const sections = ['#introduction', '#hobbies', '#traits', '#friendship'];
      
      for (const section of sections) {
        const sectionElement = page.locator(section);
        await expect(sectionElement).toBeVisible();
        
        // Check that section has non-zero dimensions
        const boundingBox = await sectionElement.boundingBox();
        expect(boundingBox).not.toBeNull();
        expect(boundingBox.width).toBeGreaterThan(0);
        expect(boundingBox.height).toBeGreaterThan(0);
        
        // Check that section width doesn't exceed viewport
        expect(boundingBox.width).toBeLessThanOrEqual(width + 1);
      }
      
      // Property 1c: Navigation is accessible
      const nav = page.locator('nav[role="navigation"]');
      await expect(nav).toBeVisible();
      
      // Property 1d: Footer is accessible
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      
      // Property 1e: Content is readable (text elements have reasonable size)
      // Check that main text elements are visible
      const introGreeting = page.locator('.intro-greeting');
      await expect(introGreeting).toBeVisible();
      
      const introGreetingBox = await introGreeting.boundingBox();
      expect(introGreetingBox).not.toBeNull();
      expect(introGreetingBox.width).toBeGreaterThan(0);
    });
  }
});
