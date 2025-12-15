import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import * as React from 'react';
// import { supabase } from '@/lib/supabase';
// import { logger } from '@/lib/logger';
import { Category } from '@/types';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Pick<Category, 'name' | 'description' | 'displayOrder'>>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (categoryIds: string[]) => Promise<void>;
  refreshCategories: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  getAllCategoriesWithAll: () => (Category & { isAll?: boolean })[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with database integration once schema is set up
      // For now, use hardcoded categories as fallback
      const hardcodedCategories: Category[] = [
        {
          id: 'entertainment',
          name: 'Entertainment',
          description: 'Streaming, gaming, and media tools',
          displayOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'developer-tools',
          name: 'Developer Tools',
          description: 'Code editors, APIs, and development platforms',
          displayOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'productivity',
          name: 'Productivity',
          description: 'Task management, note-taking, and workflow tools',
          displayOrder: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'design',
          name: 'Design',
          description: 'Graphics, UI/UX, and creative tools',
          displayOrder: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'ai-tools',
          name: 'AI Tools',
          description: 'Artificial intelligence and machine learning platforms',
          displayOrder: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'business',
          name: 'Business',
          description: 'CRM, analytics, and business management tools',
          displayOrder: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'education',
          name: 'Education',
          description: 'Learning platforms and educational resources',
          displayOrder: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'communication',
          name: 'Communication',
          description: 'Chat, video conferencing, and collaboration tools',
          displayOrder: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      setCategories(hardcodedCategories);
      console.log('CategoryContext: Using hardcoded categories as fallback');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load categories';
      console.error('Error loading categories:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  const addCategory = useCallback(async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      
      // TODO: Implement database integration once schema is set up
      console.log('CategoryContext: addCategory temporarily disabled', category);
      throw new Error('Category management temporarily disabled during deployment setup');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add category';
      console.error('Error adding category:', err);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, updates: Partial<Pick<Category, 'name' | 'description' | 'displayOrder'>>) => {
    try {
      setError(null);
      
      // TODO: Implement database integration once schema is set up
      console.log('CategoryContext: updateCategory temporarily disabled', id, updates);
      throw new Error('Category management temporarily disabled during deployment setup');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      console.error('Error updating category:', err);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setError(null);
      
      // TODO: Implement database integration once schema is set up
      console.log('CategoryContext: deleteCategory temporarily disabled', id);
      throw new Error('Category management temporarily disabled during deployment setup');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      console.error('Error deleting category:', err);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const reorderCategories = useCallback(async (categoryIds: string[]) => {
    try {
      setError(null);
      
      // TODO: Implement database integration once schema is set up
      console.log('CategoryContext: reorderCategories temporarily disabled', categoryIds);
      throw new Error('Category management temporarily disabled during deployment setup');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder categories';
      console.error('Error reordering categories:', err);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getCategoryById = useCallback((id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  }, [categories]);

  const getAllCategoriesWithAll = useCallback((): (Category & { isAll?: boolean })[] => {
    const allCategory: Category & { isAll: boolean } = {
      id: 'all',
      name: 'All Categories',
      description: 'View all products',
      displayOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAll: true,
    };
    
    return [allCategory, ...categories];
  }, [categories]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        refreshCategories,
        getCategoryById,
        getAllCategoriesWithAll,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}