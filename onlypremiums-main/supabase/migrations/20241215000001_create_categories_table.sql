-- Create categories table for dynamic category management
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint on name to prevent duplicates
ALTER TABLE categories ADD CONSTRAINT categories_name_unique UNIQUE (name);

-- Add check constraint for non-empty name
ALTER TABLE categories ADD CONSTRAINT categories_name_not_empty CHECK (LENGTH(TRIM(name)) > 0);

-- Create index on display_order for efficient ordering
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories (display_order);

-- Insert default categories from existing hardcoded system
INSERT INTO categories (id, name, description, display_order) VALUES
  ('entertainment', 'Entertainment', 'Streaming, gaming, and media tools', 1),
  ('developer-tools', 'Developer Tools', 'Code editors, APIs, and development platforms', 2),
  ('productivity', 'Productivity', 'Task management, note-taking, and workflow tools', 3),
  ('design', 'Design', 'Graphics, UI/UX, and creative tools', 4),
  ('ai-tools', 'AI Tools', 'Artificial intelligence and machine learning platforms', 5),
  ('business', 'Business', 'CRM, analytics, and business management tools', 6),
  ('education', 'Education', 'Learning platforms and educational resources', 7),
  ('communication', 'Communication', 'Chat, video conferencing, and collaboration tools', 8)
ON CONFLICT (id) DO NOTHING;

-- Add category_id foreign key to products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE products ADD COLUMN category_id TEXT REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Update existing products to use category_id instead of category string
UPDATE products SET category_id = category WHERE category_id IS NULL AND category IS NOT NULL;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();