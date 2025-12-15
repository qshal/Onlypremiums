// Error Handler Utility for OnlyPremiums
// Handles and suppresses non-critical console errors

export const suppressNonCriticalErrors = () => {
  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;

  // List of non-critical error patterns to suppress
  const suppressPatterns = [
    /Failed to load resource.*favicon/i,
    /Unrecognized feature.*'stp-credentials'/i,
    /chrome-extension:/i,
    /extension\//i,
    /moz-extension:/i,
    /safari-extension:/i,
  ];

  // Override console.error
  console.error = (...args) => {
    const message = args.join(' ');
    const shouldSuppress = suppressPatterns.some(pattern => pattern.test(message));
    
    if (!shouldSuppress) {
      originalError.apply(console, args);
    }
  };

  // Override console.warn
  console.warn = (...args) => {
    const message = args.join(' ');
    const shouldSuppress = suppressPatterns.some(pattern => pattern.test(message));
    
    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };
};

// Initialize error suppression
if (typeof window !== 'undefined') {
  suppressNonCriticalErrors();
}