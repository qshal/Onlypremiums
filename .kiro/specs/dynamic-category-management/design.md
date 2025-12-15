# Dynamic Category Management Design

## Overview

This design transforms the current static category system into a fully dynamic, admin-manageable system with a modern pill-style UI. The system will store categories in the database, allow full CRUD operations, and provide a clean user interface for filtering products.

## Architecture

### Database Layer
- **categories table**: Stores category definitions with ordering support
- **products table**: Enhanced with foreign key reference to categories
- **Migration strategy**: Migrate from hardcoded categories to database-driven system

### API Layer
- **CategoryContext**: React context for category state management
- **Database operations**: CRUD operations for categories via Supabase
- **Real-time updates**: Immediate UI updates when categories change

### UI Layer
- **Pill-style filters**: Modern button design replacing product boxes
- **Admin management**: Drag-and-drop category ordering and full CRUD interface
- **Responsive design**: Mobile-friendly horizontal scrolling

## Components and Interfaces

### Database Schema

```sql
-- Categories table (simplified - no icons)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT, -- Optional, for admin reference only
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update products table
ALTER TABLE products 
ADD COLUMN category_id UUID REFERENCES categories(id),
ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id);
```

### CategoryContext Interface

```typescript
interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (categoryIds: string[]) => Promise<void>;
  refreshCategories: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
}
```

### Category Interface

```typescript
interface Category {
  id: string;
  name: string;
  description?: string; // Optional for admin reference only
  displayOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Data Models

### Category Model
- **Primary Key**: UUID for global uniqueness
- **Name**: Unique category name (e.g., "Meta", "Netflix", "Apple")
- **Description**: Optional brief description for admin reference only
- **Display Order**: Integer for sorting (allows reordering)
- **Active**: Boolean flag for soft deletion
- **Timestamps**: Created and updated timestamps

### Simplified Design Approach
- **No icons**: Clean text-only buttons for better readability
- **Company/Product names**: Use actual brand names instead of generic categories
- **Minimal UI**: Focus on functionality over visual complexity

### Product-Category Relationship
- **Foreign Key**: products.category_id → categories.id
- **Cascade Rules**: ON DELETE SET NULL (products become uncategorized)
- **Migration**: Convert existing string categories to foreign key references

## User Interface Design

### Simple Pill Filter Layout
```
[Meta] [Netflix] [Apple] [NVIDIA] [OpenAI] [Uber] [Airbnb] [Stripe] →
```

### Pill Styling (Matching Reference Design)
- **Design**: Simple rounded buttons with company/product names
- **Active State**: Dark background (similar to selected state in reference)
- **Inactive State**: Light border with transparent background
- **Typography**: Clean, readable font without icons or descriptions
- **Layout**: Horizontal scrollable row, evenly spaced
- **Mobile**: Touch-friendly with smooth horizontal scrolling

### Key Design Changes from Current System
- **Remove product boxes**: No more large tiles with icons and descriptions
- **Simplify to text-only pills**: Just category names in clean buttons
- **Remove category icons**: Focus on clean typography
- **Streamline layout**: Single row of simple filter buttons

### Admin Category Management
- **List View**: Drag-and-drop sortable category list
- **Add Form**: Simple modal with name and optional description fields
- **Edit Form**: Inline editing or modal for updates
- **Delete Confirmation**: Confirmation dialog with impact warning
- **Simplified Interface**: Focus on essential fields only (no icon management)

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Category Filter Correctness
*For any* category selection and product dataset, filtering by a category should return only products assigned to that category
**Validates: Requirements 1.2**

### Property 2: Admin Category Validation
*For any* category creation attempt, the system should reject categories with missing names or icons
**Validates: Requirements 2.2**

### Property 3: Category Update Propagation
*For any* category update operation, the changes should be immediately visible in both admin and user interfaces
**Validates: Requirements 2.3, 3.5**

### Property 4: Product Reassignment on Category Deletion
*For any* category deletion, all products in that category should be reassigned to "Uncategorized"
**Validates: Requirements 2.4**

### Property 5: Database Persistence Consistency
*For any* category CRUD operation, the database state should match the operation performed
**Validates: Requirements 2.5, 5.5**

### Property 6: Category Dropdown Completeness
*For any* product editing session, the category dropdown should contain all active categories
**Validates: Requirements 3.1**

### Property 7: Product-Category Assignment Integrity
*For any* product-category assignment, the product should immediately appear in that category's filtered view
**Validates: Requirements 3.2, 3.3**

### Property 8: Display Order Consistency
*For any* category reordering operation, the UI should display categories in the new order across all interfaces
**Validates: Requirements 4.1, 4.3, 4.5**

### Property 9: Database Order Persistence
*For any* category order change, the new order should be persisted to the database
**Validates: Requirements 4.4**

### Property 10: Category Loading Completeness
*For any* system startup, all categories from the database should be loaded and available
**Validates: Requirements 5.1**

### Property 11: Data Validation Integrity
*For any* category data modification, invalid data should be rejected before database operations
**Validates: Requirements 5.2**

### Property 12: Category Field Completeness
*For any* category storage operation, all required fields (name, icon, description, display_order) should be included
**Validates: Requirements 5.3**

### Property 13: Query Result Ordering
*For any* database query for categories, results should be returned sorted by display_order
**Validates: Requirements 5.4**

## Error Handling

### Database Errors
- **Connection failures**: Graceful degradation with cached data
- **Constraint violations**: User-friendly error messages
- **Transaction failures**: Automatic rollback with retry logic

### Validation Errors
- **Duplicate names**: Clear error message with suggestions
- **Missing required fields**: Field-level validation feedback
- **Invalid icons**: Fallback to default icon with warning

### UI Error States
- **Loading states**: Skeleton loaders for category lists
- **Empty states**: Helpful messages when no categories exist
- **Network errors**: Retry buttons with offline indicators

## Testing Strategy

### Unit Tests
- Category CRUD operations
- Product-category assignment logic
- Filter functionality with edge cases
- Validation rules and error handling

### Property-Based Tests
- Category uniqueness across random datasets
- Display order consistency with random reordering
- Product-category integrity with random assignments
- Filter correctness with random product sets
- Database persistence with random operations

### Integration Tests
- End-to-end category management workflow
- Product filtering with dynamic categories
- Admin interface interactions
- Database migration from static to dynamic categories

## Migration Strategy

### Phase 1: Database Setup
1. Create categories table with initial data
2. Migrate existing hardcoded categories to database
3. Add category_id column to products table
4. Update products to reference category IDs

### Phase 2: Backend Updates
1. Implement CategoryContext with database operations
2. Update ProductContext to use category relationships
3. Add category management API endpoints
4. Implement real-time category updates

### Phase 3: UI Updates
1. Replace product box filters with pill-style filters
2. Add admin category management interface
3. Update product assignment UI in admin panel
4. Implement drag-and-drop category reordering

### Phase 4: Testing & Deployment
1. Run comprehensive test suite
2. Perform database migration in staging
3. Validate all functionality works correctly
4. Deploy to production with rollback plan