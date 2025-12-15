import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Badge } from '@/components/ui/badge';
import { AvailableCoupons } from '@/components/AvailableCoupons';
import { ProductIcon } from '@/components/ProductIcon';
import { useProducts } from '@/contexts/ProductContext';




export function HomePage() {
  const { plans, products, getProductInfo } = useProducts();
  const activePlans = plans.filter((plan) => plan.active !== false && !['canva', 'notion', 'grammarly', 'spotify'].includes(plan.productId));
  const popularPlans = activePlans.filter((plan) => plan.popular);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Gradient Hero Section */}
      <section className="bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
            OnlyPremiums
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light mb-8 sm:mb-12 px-2">
            Access premium productivity tools at unbeatable prices. Our verified reseller program offers legitimate licenses with full warranty and 24/7 support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link to="/plans" className="btn-apple-primary sm:btn-apple-large inline-flex items-center justify-center w-full sm:w-auto">
              Browse Plans
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link to="/faq" className="btn-apple-secondary inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg">
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-apple bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Verified Licenses</h3>
              <p className="text-body text-gray-600">
                All our software licenses are verified and authentic, sourced directly from authorized distributors with lifetime support.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowRight className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Instant Delivery</h3>
              <p className="text-body text-gray-600">
                Get your software licenses delivered instantly after payment with step-by-step setup instructions available 24/7.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                <Badge className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Best Prices</h3>
              <p className="text-body text-gray-600">
                Save up to 70% on premium software subscriptions with our exclusive reseller pricing and best deals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Netflix Style */}
      <section className="section-apple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">Available Products</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 px-2">
              Choose from our selection of premium productivity tools
            </p>
            
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
                {Object.entries(products)
                  .filter(([productKey]) => !['canva', 'notion', 'grammarly', 'spotify'].includes(productKey))
                  .map(([productKey, info]) => {
                  const productPlans = activePlans.filter((p) => p.productId === productKey);
                  const lowestPrice = productPlans.length > 0 ? Math.min(...productPlans.map((p) => p.price)) / 100 : 0;
                  
                  return (
                    <Link key={productKey} to={`/plans?product=${productKey}`}>
                      <div className="product-tile">
                        <div className="product-tile-content">
                          <div className="product-tile-icon">
                            <ProductIcon productId={productKey} productName={info.name} size="lg" fallbackEmoji={info.icon} />
                          </div>
                          <div className="product-tile-info">
                            <h3 className="product-tile-title">{info.name}</h3>
                            <p className="product-tile-subtitle">From ₹{lowestPrice.toFixed(0)}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                
                {/* Duplicate set for seamless loop */}
                {Object.entries(products)
                  .filter(([productKey]) => !['canva', 'notion', 'grammarly', 'spotify'].includes(productKey))
                  .map(([productKey, info]) => {
                  const productPlans = activePlans.filter((p) => p.productId === productKey);
                  const lowestPrice = productPlans.length > 0 ? Math.min(...productPlans.map((p) => p.price)) / 100 : 0;
                  
                  return (
                    <Link key={`${productKey}-duplicate`} to={`/plans?product=${productKey}`}>
                      <div className="product-tile">
                        <div className="product-tile-content">
                          <div className="product-tile-icon">
                            <ProductIcon productId={productKey} productName={info.name} size="lg" fallbackEmoji={info.icon} />
                          </div>
                          <div className="product-tile-info">
                            <h3 className="product-tile-title">{info.name}</h3>
                            <p className="product-tile-subtitle">From ₹{lowestPrice.toFixed(0)}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Coupons Section */}
      <section className="section-apple bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AvailableCoupons />
        </div>
      </section>

      {/* Popular Plans Section */}
      {popularPlans.length > 0 && (
        <section className="section-apple">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-hero mb-6">Most Popular Plans</h2>
              <p className="text-large text-gray-600">
                Our best-selling subscriptions with maximum savings
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {popularPlans.map((plan, index) => {
                const info = getProductInfo(plan.productId);
                const savings = Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100);
                
                return (
                  <div key={plan.id} className="card-apple p-8 relative">
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Save {savings}%
                    </div>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <ProductIcon productId={plan.productId} productName={info.name} size="lg" fallbackEmoji={info.icon} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-1">{plan.name}</h3>
                        <p className="text-gray-600 capitalize">{plan.duration} Plan</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-4xl font-bold text-black">₹{(plan.price / 100).toFixed(0)}</span>
                      <div className="flex flex-col">
                        <span className="text-lg text-gray-400 line-through">₹{(plan.originalPrice / 100).toFixed(0)}</span>
                        <span className="text-sm text-gray-500">/{plan.duration === 'monthly' ? 'month' : 'year'}</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-body">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to={`/plans/${plan.id}`} className="btn-apple-primary w-full text-center">
                      Get This Plan
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-apple bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-hero mb-6">Ready to Get Started?</h2>
          <p className="text-large text-gray-600 max-w-2xl mx-auto mb-12">
            Join thousands of users who are already saving on their favorite productivity tools. Start browsing our plans today.
          </p>
          <Link to="/plans" className="btn-apple-large inline-flex items-center">
            View All Plans
            <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Bottom Spacer */}
      <div className="h-16 sm:h-20"></div>
    </div>
  );
}
