import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Users, Zap, Clock } from "lucide-react";

interface WaitlistPopupProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: "scroll" | "time" | "manual";
}

export function WaitlistPopup({ isOpen, onClose, trigger = "manual" }: WaitlistPopupProps) {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to allow dialog to open before showing form
      const timer = setTimeout(() => setShowForm(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowForm(false);
    }
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-ivoryLight to-jadeForest/5">
          <DialogHeader className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-0 top-0 h-8 w-8 p-0 text-charcoalDeep/60 hover:text-charcoalDeep"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <DialogTitle className="text-2xl font-bold text-center text-charcoalDeep">
              Join the <span className="text-jadeForest">Harmony</span> Movement
            </DialogTitle>
            
            <p className="text-center text-charcoalDeep/70 mt-2">
              Be among the first to experience AI-powered business transformation
            </p>
          </DialogHeader>

          {/* Benefits Row */}
          <div className="grid grid-cols-3 gap-4 my-6">
            <div className="text-center">
              <Clock className="w-6 h-6 text-jadeForest mx-auto mb-2" />
              <p className="text-sm font-medium text-charcoalDeep">Early Access</p>
              <p className="text-xs text-charcoalDeep/60">First in line</p>
            </div>
            <div className="text-center">
              <Zap className="w-6 h-6 text-goldenSovereign mx-auto mb-2" />
              <p className="text-sm font-medium text-charcoalDeep">Special Pricing</p>
              <p className="text-xs text-charcoalDeep/60">Launch discounts</p>
            </div>
            <div className="text-center">
              <Users className="w-6 h-6 text-jadeForest mx-auto mb-2" />
              <p className="text-sm font-medium text-charcoalDeep">VIP Support</p>
              <p className="text-xs text-charcoalDeep/60">Priority onboarding</p>
            </div>
          </div>

          {/* Form Container */}
          <div className="relative bg-white/80 rounded-lg border border-jadeForest/20">
            {showForm ? (
              <div className="relative overflow-hidden" style={{ height: '600px' }}>
                <iframe
                  src="https://api.leadconnectorhq.com/widget/form/0b1uhgr7r2bcbKzp85yF"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                  id="popup-0b1uhgr7r2bcbKzp85yF"
                  data-layout="{'id':'POPUP'}"
                  data-trigger-type="alwaysShow"
                  data-trigger-value=""
                  data-activation-type="alwaysActivated"
                  data-activation-value=""
                  data-deactivation-type="neverDeactivate"
                  data-deactivation-value=""
                  data-form-name="A2P Form - Harmony WaitList"
                  data-height="1194"
                  data-layout-iframe-id="popup-0b1uhgr7r2bcbKzp85yF"
                  data-form-id="0b1uhgr7r2bcbKzp85yF"
                  title="A2P Form - Harmony WaitList"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center p-12">
                <div className="animate-pulse">Loading form...</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-xs text-charcoalDeep/60">
              Secure signup • No spam • Join 2,000+ businesses already waiting
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Form Embed Script */}
      {showForm && (
        <script src="https://link.msgsndr.com/js/form_embed.js" />
      )}
    </>
  );
}

// Hook for managing waitlist popup triggers
export function useWaitlistPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  // Auto-trigger based on scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      // Trigger when user scrolls 60% down the page
      if (scrollPercent > 60 && !localStorage.getItem('harmony-waitlist-shown')) {
        setTimeout(() => {
          setIsOpen(true);
          localStorage.setItem('harmony-waitlist-shown', 'true');
        }, 1000);
      }
    };

    // Only auto-trigger on certain pages
    const currentPath = window.location.pathname;
    const triggerPages = ['/', '/demo', '/marketplace', '/pricing'];
    
    if (triggerPages.includes(currentPath)) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Time-based trigger (after 45 seconds on page)
  useEffect(() => {
    if (!localStorage.getItem('harmony-waitlist-shown')) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('harmony-waitlist-shown', 'true');
      }, 45000);

      return () => clearTimeout(timer);
    }
  }, []);

  return {
    isOpen,
    openPopup,
    closePopup
  };
}