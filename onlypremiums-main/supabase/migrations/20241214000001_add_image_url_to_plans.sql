-- Add image_url column to plans table
-- This migration adds support for product card images

-- Add the image_url column to the plans table
ALTER TABLE plans ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN plans.image_url IS 'URL for the product card image displayed on the plans page';

-- Create an index for better query performance (optional, but recommended)
CREATE INDEX IF NOT EXISTS idx_plans_image_url ON plans(image_url) WHERE image_url IS NOT NULL;