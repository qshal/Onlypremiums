import { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';

interface ProductIconProps {
  productId: string;
  productName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackEmoji?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

export function ProductIcon({ 
  productId, 
  productName, 
  size = 'md', 
  className = '',
  fallbackEmoji 
}: ProductIconProps) {
  const [imageError, setImageError] = useState(false);
  const { getProductInfo } = useProducts();
  
  // Get icon from database via ProductContext
  const productInfo = getProductInfo(productId);
  const iconFromDB = productInfo.icon;
  
  // Determine if it's an image (URL, path, or base64) or emoji
  const isImage = iconFromDB.startsWith('/') || 
                  iconFromDB.startsWith('http') || 
                  iconFromDB.startsWith('data:image/');
  const emoji = fallbackEmoji || (!isImage ? iconFromDB : '📦');
  
  // If it's an image and hasn't failed to load, show image
  if (isImage && !imageError) {
    return (
      <img
        src={iconFromDB}
        alt={`${productName} logo`}
        className={`${sizeClasses[size]} object-contain ${className}`}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  }

  // Show emoji fallback
  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center ${className}`}>
      <span className={`${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : size === 'lg' ? 'text-3xl' : 'text-4xl'}`}>
        {emoji}
      </span>
    </div>
  );
}