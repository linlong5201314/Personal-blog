// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * **Feature: personal-website, Property 5: Navigation Link Completeness**
 * 
 * *For any* section on the Personal_Website, there SHALL exist a corresponding 
 * navigation link that scrolls to that section.
 * 
 * **Validates: Requirements 1.1**
 */

test.describe('Property 5: Navigation Link Completeness', () => {
  // Define the main sections that must have navigation links
  const mainSections = [
    { id: 'introduction', expectedLinkText: '关于我' },
    { id: 'hobbies', expectedLinkText: '兴趣爱好' },
    { id: 'traits', expectedLinkText: '个人特质' },
    { id: 'friendship', expectedLinkText: '交友期望' }
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/index.html');
    await page.waitForLoadState('domcontentloaded');
  });

  // Property test: For each section, verify a corresponding nav link exists
  for (const section of mainSections) {
    test(`section #${section.id} has corresponding navigation link`, async ({ page }) => {
      // Verify the section exists
      const sectionElement = page.locator(`#${section.id}`);
      await expect(sectionElement).toBeVisible();

      // Verify a navigation link pointing to this section exists
      const navLink = page.locator(`nav a[href="#${section.id}"]`);
      await expect(navLink).toBeVisible();

      // Verify the link has the expected text
      await expect(navLink).toHaveText(section.expectedLinkText);
    });
  }

  // Property test: All nav links point to existing sections
  test('all navigation links point to existing sections', async ({ page }) => {
    // Get all navigation links
    const navLinks = page.locator('nav .nav-links a.nav-link');
    const linkCount = await navLinks.count();

    expect(linkCount).toBeGreaterThan(0);

    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      
      // Verify href starts with # (internal link)
      expect(href).toMatch(/^#/);
      
      // Verify the target section exists
      const targetId = href.substring(1);
      const targetSection = page.locator(`#${targetId}`);
      await expect(targetSection).toBeVisible();
    }
  });

  // Property test: Navigation links scroll to corresponding sections
  test('clicking navigation link scrolls to corresponding section', async ({ page }) => {
    // Test with a random section from the list
    const randomIndex = Math.floor(Math.random() * mainSections.length);
    const section = mainSections[randomIndex];

    // Click the navigation link
    const navLink = page.locator(`nav a[href="#${section.id}"]`);
    await navLink.click();

    // Wait for smooth scroll to complete
    await page.waitForTimeout(500);

    // Verify the section is now in view (near top of viewport)
    const sectionElement = page.locator(`#${section.id}`);
    const boundingBox = await sectionElement.boundingBox();
    
    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      // Section should be near the top of the viewport (accounting for fixed header)
      // Allow some tolerance for the fixed navigation bar height
      expect(boundingBox.y).toBeLessThan(200);
    }
  });

  // Property test: Number of nav links equals number of main sections
  test('navigation has exactly one link per main section', async ({ page }) => {
    const navLinks = page.locator('nav .nav-links a.nav-link');
    const linkCount = await navLinks.count();

    // Should have exactly 4 links for 4 main sections
    expect(linkCount).toBe(mainSections.length);
  });
});
