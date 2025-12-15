export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export const CATEGORIES: Record<string, Category> = {
  'all': { 
    id: 'all',
    name: 'All Categories', 
    description: 'View all products',
    icon: '🌟', 
    order: 0 
  },
  'entertainment': { 
    id: 'entertainment',
    name: 'Entertainment', 
    description: 'Streaming, gaming, and media tools',
    icon: '🎬', 
    order: 1 
  },
  'developer-tools': { 
    id: 'developer-tools',
    name: 'Developer Tools', 
    description: 'Code editors, APIs, and development platforms',
    icon: '⚡', 
    order: 2 
  },
  'productivity': { 
    id: 'productivity',
    name: 'Productivity', 
    description: 'Task management, note-taking, and workflow tools',
    icon: '📊', 
    order: 3 
  },
  'design': { 
    id: 'design',
    name: 'Design', 
    description: 'Graphics, UI/UX, and creative tools',
    icon: '🎨', 
    order: 4 
  },
  'ai-tools': { 
    id: 'ai-tools',
    name: 'AI Tools', 
    description: 'Artificial intelligence and machine learning platforms',
    icon: '🤖', 
    order: 5 
  },
  'business': { 
    id: 'business',
    name: 'Business', 
    description: 'CRM, analytics, and business management tools',
    icon: '💼', 
    order: 6 
  },
  'education': { 
    id: 'education',
    name: 'Education', 
    description: 'Learning platforms and educational resources',
    icon: '📚', 
    order: 7 
  },
  'communication': { 
    id: 'communication',
    name: 'Communication', 
    description: 'Chat, video conferencing, and collaboration tools',
    icon: '💬', 
    order: 8 
  }
};

export const CATEGORY_OPTIONS = Object.values(CATEGORIES)
  .filter(cat => cat.id !== 'all')
  .sort((a, b) => a.order - b.order);

export const ALL_CATEGORIES = Object.values(CATEGORIES)
  .sort((a, b) => a.order - b.order);

export function getCategoryInfo(categoryId: string): Category {
  return CATEGORIES[categoryId] || CATEGORIES['productivity'];
}

export function isValidCategory(categoryId: string): boolean {
  return categoryId in CATEGORIES && categoryId !== 'all';
}