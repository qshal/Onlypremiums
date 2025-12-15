# Dynamic Category Management Implementation Plan

- [ ] 1. Database Schema and Migration Setup
  - Create simplified categories table (no icon field, optional description)
  - Add category_id foreign key to products table
  - Create migration to convert existing hardcoded categories to database records
  - Set up proper cascade rules for category deletion
  - _Requirements: 5.1, 5.3, 5.4_

- [ ] 1.1 Write property test for database schema integrity
  - **Property 11: Data Validation Integrity**
  - **Validates: Requirements 5.2**

- [ ] 2. Category Context and State Management
  - Create CategoryContext with full CRUD operations
  - Implement category loading from database
  - Add real-time category updates and caching
  - Handle error states and loading states
  - _Requirements: 2.1, 2.5, 5.1, 5.5_

- [ ] 2.1 Write property test for category CRUD operations
  - **Property 5: Database Persistence Consistency**
  - **Validates: Requirements 2.5, 5.5**

- [ ] 2.2 Write property test for category loading completeness
  - **Property 10: Category Loading Completeness**
  - **Validates: Requirements 5.1**

- [ ] 3. Update Product Context for Category Integration
  - Modify ProductContext to use category relationships
  - Update product CRUD operations to handle category assignments
  - Implement product-category integrity checks
  - Add uncategorized product handling
  - _Requirements: 3.2, 3.3, 3.4_

- [ ] 3.1 Write property test for product-category assignment
  - **Property 7: Product-Category Assignment Integrity**
  - **Validates: Requirements 3.2, 3.3**

- [ ] 4. Simple Pill-Style Category Filter UI Component
  - Replace current product box filters with simple text-only pill buttons
  - Remove icons and descriptions for clean design
  - Implement horizontal scrollable layout matching reference design
  - Add active/inactive states with clean styling (dark/light theme)
  - _Requirements: 1.1, 1.4, 1.5_

- [ ] 4.1 Write property test for category filtering
  - **Property 1: Category Filter Correctness**
  - **Validates: Requirements 1.2**

- [ ] 5. Category Filter Logic Implementation
  - Implement category-based product filtering
  - Add "All" category functionality
  - Handle URL parameter updates for deep linking
  - Ensure immediate UI updates when categories change
  - _Requirements: 1.2, 1.3, 3.5_

- [ ] 5.1 Write property test for filter correctness
  - **Property 1: Category Filter Correctness**
  - **Validates: Requirements 1.2**

- [ ] 6. Admin Category Management Interface
  - Create simplified category list view with CRUD operations
  - Add category creation modal with name and optional description fields only
  - Implement inline editing for category updates
  - Add delete confirmation with impact warning
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 6.1 Write property test for category validation
  - **Property 2: Admin Category Validation**
  - **Validates: Requirements 2.2**

- [ ] 6.2 Write property test for category update propagation
  - **Property 3: Category Update Propagation**
  - **Validates: Requirements 2.3, 3.5**

- [ ] 7. Category Reordering System
  - Implement drag-and-drop category reordering
  - Add display order persistence to database
  - Ensure order consistency across all interfaces
  - Handle order conflicts and validation
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 7.1 Write property test for display order consistency
  - **Property 8: Display Order Consistency**
  - **Validates: Requirements 4.1, 4.3, 4.5**

- [ ] 7.2 Write property test for order persistence
  - **Property 9: Database Order Persistence**
  - **Validates: Requirements 4.4**

- [ ] 8. Product-Category Assignment in Admin Panel
  - Update product edit forms with category dropdown
  - Ensure dropdown shows all available categories
  - Implement immediate category assignment updates
  - Add category grouping in product list views
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 8.1 Write property test for category dropdown completeness
  - **Property 6: Category Dropdown Completeness**
  - **Validates: Requirements 3.1**

- [ ] 9. Category Deletion and Product Reassignment
  - Implement safe category deletion with product reassignment
  - Create "Uncategorized" handling system
  - Add confirmation dialogs with impact preview
  - Ensure data integrity during deletion operations
  - _Requirements: 2.4, 3.4_

- [ ] 9.1 Write property test for product reassignment
  - **Property 4: Product Reassignment on Category Deletion**
  - **Validates: Requirements 2.4**

- [ ] 10. Database Migration from Static to Dynamic Categories
  - Create migration script to convert existing categories
  - Map current product categories to new category IDs
  - Ensure backward compatibility during transition
  - Add rollback procedures for safe deployment
  - _Requirements: 5.1, 5.3_

- [ ] 10.1 Write property test for migration integrity
  - **Property 12: Category Field Completeness**
  - **Validates: Requirements 5.3**

- [ ] 11. Error Handling and Validation
  - Implement comprehensive input validation
  - Add user-friendly error messages
  - Handle network failures gracefully
  - Add loading states and retry mechanisms
  - _Requirements: 5.2, 5.5_

- [ ] 11.1 Write property test for data validation
  - **Property 11: Data Validation Integrity**
  - **Validates: Requirements 5.2**

- [ ] 12. Update PlansPage with New Filter System
  - Replace existing category filters with pill-style design
  - Integrate with new CategoryContext
  - Ensure responsive design for mobile devices
  - Test all filtering combinations work correctly
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [ ] 13. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Integration Testing and Final Validation
  - Test complete category management workflow
  - Validate product filtering with dynamic categories
  - Ensure admin interface works correctly
  - Verify database operations are atomic and consistent
  - _Requirements: All requirements validation_

- [ ] 14.1 Write integration tests for complete workflow
  - Test end-to-end category management and filtering
  - Validate admin and user interface integration
  - _Requirements: All requirements_

- [ ] 15. Final Checkpoint - Complete system validation
  - Ensure all tests pass, ask the user if questions arise.