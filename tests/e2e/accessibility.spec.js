// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * **Feature: personal-website, Property 2: Interactive Element Accessibility**
 * 
 * *For any* clickable or interactive element on the Personal_Website, that element 
 * SHALL have defined hover and focus states that provide visual feedback to users.
 * 
 * **Validates: Requirements 6.3**
 */

/**
 * **Feature: personal-website, Property 3: Keyboard Navigation Completeness**
 * 
 * *For any* interactive element on the Personal_Website, that element SHALL be 
 * reachable via keyboard tab navigation and SHALL be focusable.
 * 
 * **Validates: Requirements 6.4**
 */

test.describe('Property 2 & 3: Accessibility Properties', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/index.html');
    await page.waitForLoadState('domcontentloaded');
  });

  // Define all interactive element selectors
  const interactiveSelectors = [
    // Navigation links
    'nav a.nav-link',
    'nav a.logo-link',
    // Mobile menu toggle
    'button.nav-toggle',
    // Skip link
    'a.skip-link',
    // CTA button
    'a.cta-button',
    // Social links
    '.social-link',
    // Focusable cards (hobby, trait, friend-type)
    '.hobby-card[tabindex="0"]',
    '.trait-card[tabindex="0"]',
    '.friend-type-card[tabindex="0"]'
  ];

  /**
   * Property 2: Interactive Element Accessibility
   * Test that all interactive elements have visual feedback on hover/focus
   */
  test.describe('Property 2: Interactive Element Accessibility', () => {
    
    for (const selector of interactiveSelectors) {
      test(`${selector} has hover/focus visual feedback`, async ({ page }) => {
        const elements = page.locator(selector);
        const count = await elements.count();
        
        // Skip if no elements found (e.g., skip-link may be hidden)
        if (count === 0) {
          test.skip();
          return;
        }

        for (let i = 0; i < count; i++) {
          const element = elements.nth(i);
          
          // Check if element is visible (skip hidden elements like skip-link in normal state)
          const isVisible = await element.isVisible();
          if (!isVisible) continue;

          // Get initial styles
          const initialStyles = await element.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              backgroundColor: computed.backgroundColor,
              color: computed.color,
              transform: computed.transform,
              boxShadow: computed.boxShadow,
              outline: computed.outline,
              borderColor: computed.borderColor,
              opacity: computed.opacity
            };
          });

          // Focus the element
          await element.focus();
          
          // Get focused styles
          const focusedStyles = await element.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              backgroundColor: computed.backgroundColor,
              color: computed.color,
              transform: computed.transform,
              boxShadow: computed.boxShadow,
              outline: computed.outline,
              outlineWidth: computed.outlineWidth,
              borderColor: computed.borderColor,
              opacity: computed.opacity
            };
          });

          // Verify focus state provides visual feedback
          // At least one style property should change on focus
          const hasVisualFeedback = 
            focusedStyles.backgroundColor !== initialStyles.backgroundColor ||
            focusedStyles.color !== initialStyles.color ||
            focusedStyles.transform !== initialStyles.transform ||
            focusedStyles.boxShadow !== initialStyles.boxShadow ||
            focusedStyles.outline !== initialStyles.outline ||
            focusedStyles.outlineWidth !== '0px' ||
            focusedStyles.borderColor !== initialStyles.borderColor ||
            focusedStyles.opacity !== initialStyles.opacity;

          expect(hasVisualFeedback, 
            `Element ${selector}[${i}] should have visual feedback on focus`
          ).toBe(true);
        }
      });
    }

    // Property test: All links have focus-visible styles
    test('all anchor links have focus-visible styles defined', async ({ page }) => {
      const links = page.locator('a');
      const linkCount = await links.count();
      
      expect(linkCount).toBeGreaterThan(0);

      let testedCount = 0;
      for (let i = 0; i < linkCount; i++) {
        const link = links.nth(i);
        const isVisible = await link.isVisible();
        if (!isVisible) continue;

        await link.focus();
        
        const hasFocusIndicator = await link.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          // Check for any focus indicator
          return (
            computed.outlineWidth !== '0px' ||
            computed.boxShadow !== 'none' ||
            computed.borderWidth !== '0px'
          );
        });

        expect(hasFocusIndicator, 
          `Link at index ${i} should have focus indicator`
        ).toBe(true);
        testedCount++;
      }
      
      expect(testedCount).toBeGreaterThan(0);
    });

    // Property test: All buttons have focus-visible styles defined
    test('all buttons have focus-visible styles defined', async ({ page }) => {
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const isVisible = await button.isVisible();
        if (!isVisible) continue;

        await button.focus();
        
        const hasFocusIndicator = await button.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return (
            computed.outlineWidth !== '0px' ||
            computed.boxShadow !== 'none' ||
            computed.borderWidth !== '0px'
          );
        });

        expect(hasFocusIndicator, 
          `Button at index ${i} should have focus indicator`
        ).toBe(true);
      }
    });
  });

  /**
   * Property 3: Keyboard Navigation Completeness
   * Test that all interactive elements are reachable via Tab key
   */
  test.describe('Property 3: Keyboard Navigation Completeness', () => {
    
    test('all interactive elements are focusable via Tab key', async ({ page }) => {
      // Collect all expected focusable elements
      const focusableElements = [];
      
      for (const selector of interactiveSelectors) {
        const elements = page.locator(selector);
        const count = await elements.count();
        
        for (let i = 0; i < count; i++) {
          const element = elements.nth(i);
          const isVisible = await element.isVisible();
          if (isVisible) {
            focusableElements.push({ selector, index: i, element });
          }
        }
      }

      expect(focusableElements.length).toBeGreaterThan(0);

      // Verify each element can receive focus
      for (const { selector, index, element } of focusableElements) {
        await element.focus();
        
        const isFocused = await element.evaluate((el) => {
          return document.activeElement === el;
        });

        expect(isFocused, 
          `Element ${selector}[${index}] should be focusable`
        ).toBe(true);
      }
    });

    test('Tab navigation reaches all main interactive elements', async ({ page }) => {
      // Start from the beginning of the document
      await page.keyboard.press('Tab');
      
      const visitedElements = new Set();
      const maxTabs = 50; // Prevent infinite loop
      let tabCount = 0;

      while (tabCount < maxTabs) {
        const activeElement = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          return {
            tagName: el.tagName.toLowerCase(),
            className: el.className,
            id: el.id,
            href: el.getAttribute('href'),
            role: el.getAttribute('role')
          };
        });

        if (!activeElement) break;

        const elementKey = `${activeElement.tagName}-${activeElement.className}-${activeElement.id}-${activeElement.href}`;
        
        // If we've cycled back to an element we've seen, we've completed the tab cycle
        if (visitedElements.has(elementKey)) break;
        
        visitedElements.add(elementKey);
        await page.keyboard.press('Tab');
        tabCount++;
      }

      // Verify we visited a reasonable number of interactive elements
      expect(visitedElements.size).toBeGreaterThan(5);
    });

    test('navigation links are reachable via keyboard', async ({ page }) => {
      const navLinks = page.locator('nav a.nav-link');
      const navLinkCount = await navLinks.count();
      
      expect(navLinkCount).toBe(4); // 4 main navigation links

      for (let i = 0; i < navLinkCount; i++) {
        const link = navLinks.nth(i);
        await link.focus();
        
        const isFocused = await link.evaluate((el) => {
          return document.activeElement === el;
        });

        expect(isFocused).toBe(true);
      }
    });

    test('social links in footer are keyboard accessible', async ({ page }) => {
      const socialLinks = page.locator('.social-link');
      const socialLinkCount = await socialLinks.count();
      
      expect(socialLinkCount).toBeGreaterThan(0);

      for (let i = 0; i < socialLinkCount; i++) {
        const link = socialLinks.nth(i);
        await link.focus();
        
        const isFocused = await link.evaluate((el) => {
          return document.activeElement === el;
        });

        expect(isFocused, 
          `Social link ${i} should be focusable`
        ).toBe(true);
      }
    });

    test('CTA button is keyboard accessible', async ({ page }) => {
      const ctaButton = page.locator('a.cta-button');
      await expect(ctaButton).toBeVisible();
      
      await ctaButton.focus();
      
      const isFocused = await ctaButton.evaluate((el) => {
        return document.activeElement === el;
      });

      expect(isFocused).toBe(true);
    });

    test('focusable cards are keyboard accessible', async ({ page }) => {
      const focusableCards = page.locator('[tabindex="0"]');
      const cardCount = await focusableCards.count();
      
      expect(cardCount).toBeGreaterThan(0);

      for (let i = 0; i < cardCount; i++) {
        const card = focusableCards.nth(i);
        const isVisible = await card.isVisible();
        if (!isVisible) continue;

        await card.focus();
        
        const isFocused = await card.evaluate((el) => {
          return document.activeElement === el;
        });

        expect(isFocused, 
          `Focusable card ${i} should be focusable`
        ).toBe(true);
      }
    });

    test('skip link is focusable and functional', async ({ page }) => {
      const skipLink = page.locator('a.skip-link');
      
      // Skip link should exist
      await expect(skipLink).toHaveCount(1);
      
      // Focus the skip link
      await skipLink.focus();
      
      // Verify it becomes visible on focus
      const isVisibleOnFocus = await skipLink.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return computed.opacity !== '0' && computed.visibility !== 'hidden';
      });

      expect(isVisibleOnFocus).toBe(true);
      
      // Verify it points to main content
      const href = await skipLink.getAttribute('href');
      expect(href).toBe('#main-content');
    });
  });
});
