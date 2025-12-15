import { useSearchParams } from 'react-router-dom';
import { useCategories } from '@/contexts/CategoryContext';

interface CategoryPillsProps {
  className?: string;
}

export function CategoryPills({ className = '' }: CategoryPillsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getAllCategoriesWithAll, loading } = useCategories();
  const currentCategory = searchParams.get('category') || 'all';
  
  const categories = getAllCategoriesWithAll();

  const handleCategoryChange = (categoryId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', categoryId);
    }
    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <div className={`flex gap-2 overflow-x-auto pb-2 ${className}`}>
        {/* Loading skeleton pills */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 px-4 py-2 bg-gray-200 rounded-full animate-pulse"
            style={{ width: `${80 + Math.random() * 40}px`, height: '36px' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex gap-2 overflow-x-auto pb-2 ${className}`}>
      {categories.map((category) => {
        const isActive = currentCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${isActive 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }
            `}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}