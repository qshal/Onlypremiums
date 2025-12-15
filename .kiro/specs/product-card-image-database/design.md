# Design Document

## Overview

This design implements database support for product card image URLs in the OnlyPremiums application. The feature ensures that image URLs entered by admins are properly saved to, updated in, and loaded from the Supabase database. The implementation focuses on updating the ProductContext to handle the `imageUrl` field in all database operations while maintaining backward compatibility with existing data.

## Architecture

The solution follows the existing architecture pattern:

1. **Frontend Layer**: Admin UI already has image URL input field
2. **Context Layer**: ProductContext handles database operations (needs update)
3. **Database Layer**: Supabase plans table (needs schema update)
4. **UI Layer**: PlansPage displays images (already implemented)

The main changes will be in the ProductContext to include `imageUrl` in database operations and ensure the database schema supports the `image_url` column.

## Components and Interfaces

### ProductContext Updates

The ProductContext needs to be updated to handle the `imageUrl` field in:

- `addPlan()`: Include `image_url` in INSERT operations
- `updatePlan()`: Include `image_url` in UPDATE operations  
- `refreshPlans()`: Include `image_url` in SELECT operations and mapping

### Database Schema

The `plans` table needs to support an `image_url` column:

```sql
ALTER TABLE plans ADD COLUMN image_url TEXT;
```

### Type Mapping

Update the database field mapping:
- Frontend: `imageUrl` (camelCase)
- Database: `image_url` (snake_case)

## Data Models

### Plan Interface (Already Exists)
```typescript
interface Plan {
  id: string;
  productId: string;
  name: string;
  description: string;
  duration: PlanDuration;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  features: string[];
  activationMethod: ActivationMethod;
  imageUrl?: string; // This field exists but not saved to DB
  popular: boolean;
  active: boolean;
  createdAt: Date;
}
```

### Database Record Mapping
```typescript
// Database record (snake_case)
{
  id: string;
  name: string;
  description: string;
  product_id: string;
  duration: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  features: string[];
  activation_method: string;
  image_url: string | null; // New field
  popular: boolean;
  active: boolean;
  created_at: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing all properties identified in the prework, I found several redundant properties:
- Properties 1.1, 3.2 are the same (insert operations)
- Properties 1.2, 3.3 are the same (update operations)  
- Properties 1.3, 2.4 are the same (load operations)
- Properties 1.4, 3.4 are the same (null handling)

The consolidated properties provide unique validation value:

**Property 1: Image URL persistence in database operations**
*For any* plan with an imageUrl, when saved to the database and then loaded, the imageUrl should be preserved exactly
**Validates: Requirements 1.1, 1.2, 1.3, 2.4, 3.2, 3.3**

**Property 2: Null image URL handling**
*For any* plan without an imageUrl, database operations should complete successfully without errors
**Validates: Requirements 1.4, 3.4**

**Property 3: Data consistency across users**
*For any* plan with an imageUrl, all users should see the same image when viewing that plan
**Validates: Requirements 2.5**

**Property 4: Migration data preservation**
*For any* existing plan, adding the image_url column should not affect any existing plan data
**Validates: Requirements 3.5**

## Error Handling

### Database Errors
- Handle cases where `image_url` column doesn't exist yet
- Gracefully handle null/undefined `imageUrl` values
- Provide meaningful error messages for database operation failures

### UI Error Handling
- Display fallback placeholder when `imageUrl` is null/empty
- Handle broken image URLs with `onError` handlers
- Maintain existing error handling for other plan fields

## Testing Strategy

### Unit Testing
- Test ProductContext methods with and without `imageUrl`
- Test database field mapping between camelCase and snake_case
- Test error handling for null/undefined `imageUrl` values
- Verify backward compatibility with existing plans

### Property-Based Testing
- Use a property-based testing library (such as fast-check for TypeScript)
- Configure each property-based test to run a minimum of 100 iterations
- Tag each property-based test with comments referencing the design document properties
- Use the format: '**Feature: product-card-image-database, Property {number}: {property_text}**'

**Property-based testing requirements**:
- Each correctness property must be implemented by a single property-based test
- Property tests verify universal properties that should hold across all inputs
- Unit tests and property tests are complementary and both must be included

### Integration Testing
- Test complete flow: Admin adds imageUrl → Saves to DB → Displays on frontend
- Test image URL updates and deletions
- Verify fallback behavior for missing/broken images