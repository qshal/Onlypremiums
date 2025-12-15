# Implementation Plan

- [x] 1. Update database operations in ProductContext


  - Modify the `refreshPlans()` method to include `image_url` in SELECT query and field mapping
  - Update the `addPlan()` method to include `image_url` in INSERT operations
  - Update the `updatePlan()` method to include `image_url` in UPDATE operations
  - _Requirements: 1.1, 1.2, 1.3, 3.1, 3.2, 3.3_

- [ ]* 1.1 Write property test for image URL persistence
  - **Property 1: Image URL persistence in database operations**
  - **Validates: Requirements 1.1, 1.2, 1.3, 2.4, 3.2, 3.3**

- [ ]* 1.2 Write property test for null image URL handling
  - **Property 2: Null image URL handling**
  - **Validates: Requirements 1.4, 3.4**

- [x] 2. Verify database schema supports image_url column


  - Check if the `plans` table has an `image_url` column
  - Add migration or manual column addition if needed
  - Test that the column accepts TEXT values and NULL
  - _Requirements: 3.1, 3.5_

- [ ]* 2.1 Write property test for data consistency
  - **Property 3: Data consistency across users**
  - **Validates: Requirements 2.5**

- [ ]* 2.2 Write property test for migration data preservation
  - **Property 4: Migration data preservation**
  - **Validates: Requirements 3.5**

- [x] 3. Test the complete image URL flow


  - Verify that admin can add plans with image URLs
  - Verify that image URLs are saved to database
  - Verify that image URLs are loaded and displayed correctly
  - Test fallback behavior for null/empty image URLs
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.4_

- [ ]* 3.1 Write unit tests for ProductContext methods
  - Test `addPlan()` with and without imageUrl
  - Test `updatePlan()` with imageUrl changes
  - Test `refreshPlans()` mapping includes imageUrl
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 4. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.



- [ ] 5. Verify UI integration works correctly
  - Test that PlansPage displays images from database
  - Verify fallback placeholder shows for plans without images
  - Test error handling for broken image URLs
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ]* 5.1 Write integration tests for UI image display
  - Test complete flow from database to UI display
  - Test fallback behavior for missing images
  - Test error handling for broken image URLs



  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 6. Final Checkpoint - Make sure all tests are passing
  - Ensure all tests pass, ask the user if questions arise.