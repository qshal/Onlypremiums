import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { CouponProvider } from "@/contexts/CouponContext";

import { SupabaseErrorBoundary } from "@/components/SupabaseErrorBoundary";
import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/pages/HomePage";
import { PlansPage } from "@/pages/PlansPage";
import { PlanDetailPage } from "@/pages/PlanDetailPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { OrderSuccessPage } from "@/pages/OrderSuccessPage";
import { OrderSuccessTestPage } from "@/pages/OrderSuccessTestPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { FunctionalAdminPage } from "@/pages/FunctionalAdminPage";
import { SupportPage } from "@/pages/SupportPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { FAQPage } from "@/pages/FAQPage";
import { RefundPolicyPage } from "@/pages/RefundPolicyPage";
import { TermsOfServicePage } from "@/pages/TermsOfServicePage";
import { ShippingPolicyPage } from "@/pages/ShippingPolicyPage";
import { PaymentTestPage } from "@/pages/PaymentTestPage";
import { Toaster } from "@/components/ui/toaster";

// Fast loading component - Deployment fix Dec 15, 2024
function FastLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">OnlyPremiums</h2>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <SupabaseErrorBoundary>
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <AdminProvider>
            <CouponProvider>
                <CartProvider>
                  <OrderProvider>
              <Suspense fallback={<FastLoader />}>
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/plans" element={<PlansPage />} />
                    <Route path="/plans/:planId" element={<PlanDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success" element={<OrderSuccessPage />} />
                    <Route path="/test-success" element={<OrderSuccessTestPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/admin" element={<FunctionalAdminPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/refund" element={<RefundPolicyPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />
                    <Route path="/shipping" element={<ShippingPolicyPage />} />
                    <Route path="/contact" element={<SupportPage />} />
                    <Route path="/test-payment" element={<PaymentTestPage />} />
                  </Route>
                </Routes>
              </Suspense>
              <Toaster />
                  </OrderProvider>
                </CartProvider>
            </CouponProvider>
          </AdminProvider>
        </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </SupabaseErrorBoundary>
  );
}

export default App;
