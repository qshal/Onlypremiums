import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X, FileText, Search } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/contexts/ProductContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ClaimingInstructionsModal } from '@/components/ClaimingInstructionsModal';
import { useClaimingAccess } from '@/hooks/useClaimingAccess';

export function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showClaimingModal, setShowClaimingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use the new claiming access hook
  const { hasClaimingAccess, getMostRecentOrderWithClaiming } = useClaimingAccess();



  const handleLogout = async () => {
    try {
      logout();
      // Small delay to ensure logout completes
      setTimeout(() => {
        navigate('/');
      }, 100);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to home even if logout fails
      navigate('/');
    }
  };

  const handleOpenClaimingModal = () => {
    setShowClaimingModal(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/plans?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full nav-apple">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            {/* Logo Image */}
            <img 
              src="https://i.ibb.co/MDRnSNmr/Whats-App-Image-2025-12-13-at-20-39-38-c0704b34.jpg" 
              alt="OnlyPremiums Logo"
              className="h-10 w-10 object-contain"
            />
            {/* Font Image */}
            <img 
              src="https://i.ibb.co/ZRW0zbrk/Chat-GPT-Image-Dec-14-2025-08-47-38-AM.png" 
              alt="OnlyPremiums"
              className="h-14 object-contain"
            />
          </Link>

          {/* Desktop Navigation with Search */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link
                to="/plans"
                className="text-sm font-normal text-black/80 hover:text-black transition-all duration-300 hover:scale-105 relative group"
              >
                OnlyPremiums
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {Object.entries(products).slice(0, 2).map(([key, product]) => (
                <Link
                  key={key}
                  to={`/plans?product=${key}`}
                  className="text-sm font-normal text-black/80 hover:text-black transition-all duration-300 hover:scale-105 relative group"
                >
                  {product.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
            
            {/* Integrated Search */}
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:scale-105 transition-all duration-300 hover:bg-gray-50"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Claiming Instructions Notification */}
            {user && hasClaimingAccess && (
              <button 
                className="text-sm font-normal text-black/80 hover:text-black transition-colors duration-200 flex items-center gap-1"
                onClick={handleOpenClaimingModal}
                title="View claiming instructions for your purchased plans"
              >
                <FileText className="h-4 w-4" />
                <span>Claim</span>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              </button>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <button className="text-sm font-normal text-black/80 hover:text-black transition-all duration-300 flex items-center hover:scale-110 group-hover:rotate-12">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px] animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-sm font-normal text-black/80 hover:text-black transition-colors duration-200">
                    <User className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="text-sm text-gray-900 hover:text-black hover:bg-gray-50 cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-gray-700" />
                    Dashboard
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="text-sm text-gray-900 hover:text-black hover:bg-gray-50 cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-gray-700" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-sm text-gray-900 hover:text-black hover:bg-gray-50 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4 text-gray-700" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <button 
                  className="text-sm font-normal text-black/80 hover:text-black transition-colors duration-200" 
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </button>
                <button 
                  className="btn-apple-primary text-sm px-4 py-1.5" 
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-black/80 hover:text-black transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            <Link
              to="/plans"
              className="block px-2 py-2 text-sm font-medium text-black/80 hover:text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              OnlyPremiums
            </Link>
            {Object.entries(products).map(([key, product]) => (
              <Link
                key={key}
                to={`/plans?product=${key}`}
                className="block px-2 py-2 text-sm font-medium text-black/80 hover:text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                {product.name}
              </Link>
            ))}
            {!user && (
              <div className="pt-2 space-y-2">
                <button
                  className="btn-apple-secondary w-full text-center"
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign in
                </button>
                <button
                  className="btn-apple-primary w-full text-center"
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </button>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Claiming Instructions Modal */}
      <ClaimingInstructionsModal
        isOpen={showClaimingModal}
        onClose={() => setShowClaimingModal(false)}
        recentOrder={getMostRecentOrderWithClaiming()}
      />
    </header>
  );
}
