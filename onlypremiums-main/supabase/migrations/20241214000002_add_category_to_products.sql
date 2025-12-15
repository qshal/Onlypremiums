-- Add category support to products table
-- This migration adds category filtering functionality

-- Add the category column to the products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'productivity';

-- Add constraint to ensure valid categories
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check 
  CHECK (category IN ('entertainment', 'developer-tools', 'productivity', 'design', 'ai-tools', 'business', 'education', 'communication'));

-- Add a comment to document the column
COMMENT ON COLUMN products.category IS 'Product category for filtering (entertainment, developer-tools, productivity, design, ai-tools, business, education, communication)';

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Update existing products to have a default category if they don't have one
UPDATE products SET category = 'productivity' WHERE category IS NULL OR category = '';