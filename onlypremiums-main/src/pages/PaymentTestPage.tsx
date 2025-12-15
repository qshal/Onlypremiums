import { useState } from 'react';
import { testRazorpayIntegration, testMinimalPayment } from '@/utils/testPayment';

export function PaymentTestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runIntegrationTest = () => {
    addResult('🧪 Starting Razorpay integration test...');
    const result = testRazorpayIntegration();
    if (result) {
      addResult('✅ Integration test passed');
    } else {
      addResult('❌ Integration test failed');
    }
  };

  const runPaymentTest = () => {
    addResult('💳 Starting minimal payment test...');
    testMinimalPayment();
    addResult('ℹ️ Payment modal should open');
  };

  const checkEnvironment = () => {
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET;
    
    addResult(`Key ID: ${keyId ? '✅ Loaded' : '❌ Missing'}`);
    addResult(`Key Secret: ${keySecret ? '✅ Loaded' : '❌ Missing'}`);
    
    if (keyId && keySecret) {
      addResult('✅ All environment variables configured');
    } else {
      addResult('❌ Missing environment variables');
    }
  };

  return (
    <div className="container py-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="glass-neuro rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Payment Integration Test</h1>
          <p className="text-white/70">
            Test your Razorpay integration to ensure payments are working correctly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="glass-neuro rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Test Controls</h2>
            
            <div className="space-y-4">
              <button
                onClick={checkEnvironment}
                className="w-full btn-glass rounded-xl py-3 text-white font-semibold hover:bg-white/20 transition-all"
              >
                🔍 Check Environment Variables
              </button>
              
              <button
                onClick={runIntegrationTest}
                className="w-full btn-glass rounded-xl py-3 text-white font-semibold hover:bg-white/20 transition-all"
              >
                🧪 Test Razorpay Integration
              </button>
              
              <button
                onClick={runPaymentTest}
                className="w-full btn-glass rounded-xl py-3 text-white font-semibold hover:bg-white/20 transition-all"
              >
                💳 Test Payment Modal (₹1)
              </button>
              
              <button
                onClick={() => setTestResults([])}
                className="w-full glass border-white/30 rounded-xl py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                🗑️ Clear Results
              </button>
            </div>

            <div className="mt-6 p-4 glass rounded-xl">
              <h3 className="text-white font-semibold mb-2">Current Configuration</h3>
              <div className="text-sm text-white/70 space-y-1">
                <p>Key ID: {import.meta.env.VITE_RAZORPAY_KEY_ID ? '✅ Configured' : '❌ Missing'}</p>
                <p>Key Secret: {import.meta.env.VITE_RAZORPAY_KEY_SECRET ? '✅ Configured' : '❌ Missing'}</p>
                <p>Environment: {import.meta.env.VITE_RAZORPAY_KEY_ID?.includes('live') ? '🔴 LIVE' : '🟡 TEST'}</p>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="glass-neuro rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Test Results</h2>
            
            <div className="glass rounded-xl p-4 h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-white/50 text-center py-8">
                  No test results yet. Run a test to see results here.
                </p>
              ) : (
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm text-white/80 font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="glass-neuro rounded-2xl p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Testing Instructions</h2>
          <div className="text-white/70 space-y-3">
            <div>
              <h3 className="text-white font-semibold">1. Check Environment Variables</h3>
              <p>Verify that your Razorpay credentials are properly loaded.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold">2. Test Integration</h3>
              <p>Check if Razorpay SDK loads correctly and configuration is valid.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold">3. Test Payment Modal</h3>
              <p>Open Razorpay payment modal with ₹1 test amount. <strong>Note:</strong> This will attempt a real payment with your live keys.</p>
            </div>
            <div className="p-3 glass rounded-xl border border-yellow-500/30">
              <p className="text-yellow-300 font-semibold">⚠️ Warning</p>
              <p className="text-yellow-200 text-sm">You are using LIVE Razorpay keys. Test payments will be real transactions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}