# Implementation Plan

- [x] 1. Implement color utility functions





  - [x] 1.1 Create hexToHsl function for color conversion


    - Convert HEX color to HSL format
    - Handle both 3-digit and 6-digit HEX formats
    - _Requirements: 1.1_
  - [x] 1.2 Create getHueDifference function


    - Calculate hue difference between two colors
    - Return value in range 0-180 degrees
    - _Requirements: 1.1_
  - [ ]* 1.3 Write property test for hue difference calculation
    - **Property 1: Adjacent Theme Hue Difference**
    - **Validates: Requirements 1.1**
  - [x] 1.4 Create getContrastRatio function


    - Calculate WCAG contrast ratio between two colors
    - Implement relative luminance calculation
    - _Requirements: 2.3_
  - [ ]* 1.5 Write property test for contrast ratio
    - **Property 3: Text-Background Contrast Ratio**
    - **Validates: Requirements 2.3**


- [x] 2. Implement theme sorting algorithm




  - [x] 2.1 Create sortThemesByColorSimilarity function


    - Sort themes by primary color hue similarity
    - Use nearest neighbor algorithm for optimal ordering
    - Ensure adjacent themes have hue difference <= 60 degrees
    - _Requirements: 1.1_
  - [ ]* 2.2 Write property test for theme sorting
    - **Property 1: Adjacent Theme Hue Difference**
    - **Validates: Requirements 1.1**


- [x] 3. Enhance theme configuration




  - [x] 3.1 Add new gradient properties to theme objects


    - Add bgGradient, navGradient, sectionGradient1, sectionGradient2
    - Update all 12 existing themes with appropriate gradient values
    - _Requirements: 3.1, 5.1_
  - [x] 3.2 Create validateThemeConfig function


    - Validate all required fields are present
    - Validate color format correctness
    - _Requirements: 5.2_
  - [ ]* 3.3 Write property test for theme configuration completeness
    - **Property 4: Theme Configuration Completeness**
    - **Validates: Requirements 3.1, 5.1, 5.2**


- [x] 4. Update theme applier for navigation bar




  - [x] 4.1 Implement updateNavigationBar function


    - Apply navGradient to navigation background
    - Ensure transparency is between 0.8-0.9
    - Maintain backdrop-filter blur effect
    - _Requirements: 2.1, 2.2_
  - [ ]* 4.2 Write property test for navigation transparency
    - **Property 2: Navigation Bar Transparency Range**
    - **Validates: Requirements 2.1**


- [x] 5. Update theme applier for page background




  - [x] 5.1 Implement updatePageBackground function


    - Apply bgGradient to body background
    - Apply sectionGradient1 and sectionGradient2 to respective sections
    - _Requirements: 3.1, 3.2_
  - [x] 5.2 Update CSS variables for background gradients


    - Add new CSS custom properties for gradients
    - Ensure smooth transition with 2s duration
    - _Requirements: 1.2, 3.3_


- [x] 6. Update glow orbs and particles




  - [x] 6.1 Update updateGlowAndParticles function


    - Apply theme colors to glow orbs
    - Update particle colors from theme palette
    - Ensure synchronized transition timing
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 7. Integrate and test theme switching





  - [x] 7.1 Update initThemeSwitcher to use sorted themes


    - Call sortThemesByColorSimilarity on initialization
    - Apply sorted theme queue for switching
    - _Requirements: 1.1_
  - [x] 7.2 Verify transition timing


    - Ensure 2s transition duration
    - Ensure 1s minimum hold time between switches
    - _Requirements: 1.2, 1.3_


- [x] 8. Checkpoint - Ensure all tests pass




  - Ensure all tests pass, ask the user if questions arise.
