import { useState, useMemo, useEffect, useRef } from 'react';
import * as React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AvailableCoupons } from '@/components/AvailableCoupons';
import { ProductIcon } from '@/components/ProductIcon';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Plan } from '@/types';
import { ALL_CATEGORIES, getCategoryInfo } from '@/constants/categories';
import { CategoryPills } from '@/components/CategoryPills';

export function PlansPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productFilter = searchParams.get('product');
  const categoryFilter = searchParams.get('category');
  const urlSearchQuery = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { plans, products, getProductInfo } = useProducts();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  // Update search query when URL changes
  React.useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (!isScrolling) {
        container.classList.add('paused');
        isScrolling = true;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        container.classList.remove('paused');
        isScrolling = false;
      }, 2000); // Resume animation 2 seconds after scrolling stops
    };

    const handleMouseEnter = () => {
      container.classList.add('paused');
    };

    const handleMouseLeave = () => {
      if (!isScrolling) {
        container.classList.remove('paused');
      }
    };

    const wrapper = container.parentElement;
    if (wrapper) {
      wrapper.addEventListener('scroll', handleScroll);
      wrapper.addEventListener('mouseenter', handleMouseEnter);
      wrapper.addEventListener('mouseleave', handleMouseLeave);
      wrapper.addEventListener('touchstart', handleMouseEnter);
      wrapper.addEventListener('touchend', handleMouseLeave);

      return () => {
        wrapper.removeEventListener('scroll', handleScroll);
        wrapper.removeEventListener('mouseenter', handleMouseEnter);
        wrapper.removeEventListener('mouseleave', handleMouseLeave);
        wrapper.removeEventListener('touchstart', handleMouseEnter);
        wrapper.removeEventListener('touchend', handleMouseLeave);
        clearTimeout(scrollTimeout);
      };
    }
  }, []);

  const scrollLeft = () => {
    const wrapper = scrollWrapperRef.current;
    if (wrapper) {
      wrapper.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const wrapper = scrollWrapperRef.current;
    if (wrapper) {
      wrapper.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      if (plan.active === false) return false;
      
      // Category filtering
      if (categoryFilter && categoryFilter !== 'all') {
        const productInfo = getProductInfo(plan.productId);
        if (productInfo.category !== categoryFilter) return false;
      }
      
      if (productFilter && plan.productId !== productFilter) return false;
      
      // Search functionality
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const productInfo = getProductInfo(plan.productId);
        const searchableText = [
          plan.name || '',
          plan.description || '',
          productInfo.name || '',
          plan.productId || '',
          ...(plan.features || [])
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) return false;
      }
      
      return true;
    });
  }, [plans, productFilter, categoryFilter, searchQuery, getProductInfo]);

  const handleAddToCart = async (plan: Plan) => {
    try {
      await addItem(plan);
      toast({
        title: 'Added to cart',
        description: `${plan.name} (${plan.duration}) has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  };





  return (
    <div className="min-h-screen bg-white">
      {/* Gradient Hero Section */}
      <section className="bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
            {productFilter ? getProductInfo(productFilter).name : 'OnlyPremiums'}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light px-2">
            Choose the perfect subscription plan for your needs. All plans include full access to premium features.
          </p>
        </div>
      </section>



      {/* Category Filters */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Browse by Category</h2>
            <p className="text-base sm:text-lg text-gray-700 font-medium mb-6 sm:mb-8 px-2">Filter products by their category to find what you need</p>
            
            {/* Simple Pill-Style Category Filters */}
            <CategoryPills className="mb-8" />

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Browse by Product</h3>
            <p className="text-base sm:text-lg text-gray-700 font-medium mb-6 sm:mb-8 px-2">Choose from our selection of premium productivity tools</p>
            
            {/* Netflix-style Product Tiles with Auto-scroll */}
            <div className="scroll-nav-container">
              <button 
                className="scroll-nav-btn scroll-nav-btn-left"
                onClick={scrollLeft}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                className="scroll-nav-btn scroll-nav-btn-right"
                onClick={scrollRight}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div ref={scrollWrapperRef} className="manual-scroll-wrapper pb-4 px-1">
                <div ref={scrollContainerRef} className="scroll-container auto-scroll">
                {/* First set of tiles */}
                <button
                  className={`product-tile ${!productFilter ? 'product-tile-active' : ''}`}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('product');
                    setSearchParams(newParams);
                  }}
                >
                  <div className="product-tile-content">
                    <div className="product-tile-icon">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">All</span>
                      </div>
                    </div>
                    <div className="product-tile-info">
                      <h3 className="product-tile-title">All Products</h3>
                      <p className="product-tile-subtitle">View everything</p>
                    </div>
                  </div>
                </button>

                {Object.entries(products)
                  .filter(([, info]) => !categoryFilter || categoryFilter === 'all' || info.category === categoryFilter)
                  .map(([key, info]) => (
                  <button
                    key={key}
                    className={`product-tile ${productFilter === key ? 'product-tile-active' : ''}`}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('product', key);
                      setSearchParams(newParams);
                    }}
                  >
                    <div className="product-tile-content">
                      <div className="product-tile-icon">
                        <ProductIcon productId={key} productName={info.name} size="lg" fallbackEmoji={info.icon} />
                      </div>
                      <div className="product-tile-info">
                        <h3 className="product-tile-title">{info.name}</h3>
                        <p className="product-tile-subtitle">Premium plans</p>
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* Duplicate set for seamless loop */}
                <button
                  className={`product-tile ${!productFilter ? 'product-tile-active' : ''}`}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('product');
                    setSearchParams(newParams);
                  }}
                >
                  <div className="product-tile-content">
                    <div className="product-tile-icon">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">All</span>
                      </div>
                    </div>
                    <div className="product-tile-info">
                      <h3 className="product-tile-title">All Products</h3>
                      <p className="product-tile-subtitle">View everything</p>
                    </div>
                  </div>
                </button>

                {Object.entries(products)
                  .filter(([, info]) => !categoryFilter || categoryFilter === 'all' || info.category === categoryFilter)
                  .map(([key, info]) => (
                  <button
                    key={`${key}-duplicate`}
                    className={`product-tile ${productFilter === key ? 'product-tile-active' : ''}`}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('product', key);
                      setSearchParams(newParams);
                    }}
                  >
                    <div className="product-tile-content">
                      <div className="product-tile-icon">
                        <ProductIcon productId={key} productName={info.name} size="lg" fallbackEmoji={info.icon} />
                      </div>
                      <div className="product-tile-info">
                        <h3 className="product-tile-title">{info.name}</h3>
                        <p className="product-tile-subtitle">Premium plans</p>
                      </div>
                    </div>
                  </button>
                ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="section-apple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid-apple">
            {filteredPlans.map((plan) => {
              const info = getProductInfo(plan.productId);
              const savings = Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100);

              return (
                <div key={plan.id} className="card-apple overflow-visible relative product-card-with-image group">
                  {plan.popular && (
                    <div className="absolute -top-3 left-4 right-4 z-20">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-xl border-2 border-white text-center transform -rotate-1">
                        🔥 MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  {/* Product Image Section - 30% of card height */}
                  {plan.imageUrl ? (
                    <img 
                      src={plan.imageUrl} 
                      alt={plan.name}
                      className="product-card-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const placeholder = target.nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="product-card-image-placeholder">
                      <ProductIcon productId={plan.productId} productName={info.name} size="xl" fallbackEmoji={info.icon} />
                    </div>
                  )}
                  
                  <div className="product-card-content">
                    <div className={`p-8 pb-4 ${plan.popular ? 'pt-12' : ''}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <ProductIcon productId={plan.productId} productName={info.name} size="lg" fallbackEmoji={info.icon} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                        <p className="text-gray-700 font-medium capitalize">{plan.duration} Plan</p>
                      </div>
                    </div>
                    <p className="text-body text-gray-700 font-medium mb-6">{plan.description}</p>
                  </div>
                  <div className="px-8 flex-1 flex flex-col">
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-4xl font-bold text-gray-900">₹{(plan.price / 100).toFixed(0)}</span>
                      <div className="flex flex-col">
                        <span className="text-lg text-gray-400 line-through">₹{(plan.originalPrice / 100).toFixed(0)}</span>
                        <span className="text-sm text-gray-500">/{plan.duration === 'monthly' ? 'month' : 'year'}</span>
                      </div>
                      <div className="ml-auto bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 text-sm font-semibold text-green-600">
                        Save {savings}%
                      </div>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-800">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                          <span className="text-body font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-3 pb-8">
                      <button 
                        className="btn-apple-primary w-full text-center"
                        onClick={() => handleAddToCart(plan)}
                      >
                        Add to Cart
                      </button>
                      <Link to={`/plans/${plan.id}`} className="btn-apple-secondary w-full text-center block">
                        View Details
                      </Link>
                    </div>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {filteredPlans.length === 0 && (
        <section className="section-apple">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card-apple p-12 max-w-md mx-auto">
              <p className="text-body text-gray-700 font-medium mb-6">
                {categoryFilter && categoryFilter !== 'all' 
                  ? `No plans found in the ${getCategoryInfo(categoryFilter).name} category.`
                  : productFilter 
                    ? 'No plans found for the selected product.'
                    : 'No plans found.'
                }
              </p>
              <button 
                className="btn-apple-primary" 
                onClick={() => setSearchParams({})}
              >
                View All Plans
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Available Coupons - Moved to Bottom */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AvailableCoupons />
        </div>
      </section>

      {/* Bottom Spacer */}
      <div className="h-16 sm:h-20"></div>
    </div>
  );
}
