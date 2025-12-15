import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ProductContext } from '@/contexts/ProductContext';

// Default empty products for fallback when context is not available
const defaultProducts = {};

export function Footer() {
  const context = useContext(ProductContext);
  const products = context?.products ?? defaultProducts;
  
  return (
    <footer className="border-t bg-gradient-to-r from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50"></div>
      <div className="relative container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center group">
              <img 
                src="https://i.ibb.co/ZRW0zbrk/Chat-GPT-Image-Dec-14-2025-08-47-38-AM.png" 
                alt="OnlyPremiums"
                className="h-12 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-600 font-medium">
              Premium tools subscriptions at unbeatable prices. Trusted by thousands of users worldwide.
            </p>
          </div>

          {/* Products */}
          <div className="glass-card-3d p-6 float-3d">
            <h3 className="font-bold mb-4 text-gray-900">Products</h3>
            <ul className="space-y-3 text-sm">
              {Object.entries(products).map(([key, product]) => (
                <li key={key}>
                  <Link to={`/plans?product=${key}`} className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="glass-card-3d p-6 float-3d">
            <h3 className="font-bold mb-4 text-gray-900">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">
                  Support Center
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="glass-card-3d p-6 float-3d">
            <h3 className="font-bold mb-4 text-gray-900">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 font-medium">© {new Date().getFullYear()} OnlyPremiums. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
