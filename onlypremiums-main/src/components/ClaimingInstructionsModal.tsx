import { useState } from 'react';
import { X, Clock, Mail, CheckCircle2, Copy, ExternalLink, Package } from 'lucide-react';
import { useClaimingAccess } from '@/hooks/useClaimingAccess';

interface ClaimingInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrder?: any; // Optional since we're not using it
}

export function ClaimingInstructionsModal({ isOpen, onClose }: ClaimingInstructionsModalProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Use the claiming access hook to get all available instructions
  const { availableInstructions, purchasedPlans, loading } = useClaimingAccess();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const formatInstructions = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index} className="mb-2">
        {line.trim() && (
          <p className="text-gray-700 leading-relaxed">{line}</p>
        )}
      </div>
    ));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-in fade-in duration-200"
      onClick={onClose}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        minHeight: '100vh'
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          margin: 'auto',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Method of Claiming</h2>
              <p className="text-sm text-gray-600">How to activate your subscription</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 rounded-xl p-2 text-gray-600 hover:text-gray-800 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading claiming instructions...</p>
            </div>
          ) : availableInstructions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">No Instructions Available</h3>
              <p className="text-gray-600 mb-4">
                Claiming instructions haven't been set up for your purchased plans yet.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <p className="text-gray-700 text-sm">
                  Our admin team will add claiming instructions soon. Contact support if you need immediate assistance.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {availableInstructions.map((instruction, index) => {
                // Find the purchased plan info
                const purchasedPlan = purchasedPlans.find(p => p.planId === instruction.planId);
                
                return (
                  <div key={instruction.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    {/* Plan Info */}
                    {purchasedPlan && (
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-black mb-1">{purchasedPlan.planName}</h3>
                            <p className="text-sm text-gray-600">
                              Purchased: {purchasedPlan.purchaseDate.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Purchased
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Method Title */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <h4 className="text-lg font-semibold text-black">{instruction.methodTitle}</h4>
                    </div>

                    {/* Instructions */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Step-by-step instructions:</h5>
                      <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-[120px]">
                        {formatInstructions(instruction.instructions)}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {instruction.estimatedTime && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-gray-600">Estimated time:</span>
                          <span className="text-black font-medium">{instruction.estimatedTime}</span>
                        </div>
                      )}
                      
                      {instruction.contactInfo && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-green-600" />
                          <span className="text-gray-600">Support:</span>
                          <button
                            onClick={() => copyToClipboard(instruction.contactInfo!)}
                            className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                          >
                            {instruction.contactInfo}
                            {copiedText === instruction.contactInfo ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Link Section */}
                    {instruction.linkUrl && (
                      <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                          <ExternalLink className="h-5 w-5 text-blue-600" />
                          <h6 className="font-medium text-black">Activation Link</h6>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Click the link below to proceed with the activation process:
                        </p>
                        <a
                          href={instruction.linkUrl.startsWith('http') ? instruction.linkUrl : `https://${instruction.linkUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-apple-primary text-sm inline-flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open Activation Link
                        </a>
                        <button
                          onClick={() => copyToClipboard(instruction.linkUrl!)}
                          className="ml-2 btn-apple-secondary text-sm inline-flex items-center gap-1"
                        >
                          {copiedText === instruction.linkUrl ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copy Link
                            </>
                          )}
                        </button>
                      </div>
                    )}


                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                Need help? Contact our support team for assistance.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('/support', '_blank')}
                  className="btn-apple-secondary text-sm flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Support Center
                </button>
                <button
                  onClick={onClose}
                  className="btn-apple-primary text-sm"
                >
                  Got it!
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}