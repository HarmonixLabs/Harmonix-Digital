import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, CheckCircle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WaitlistFormProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: string;
}

interface WaitlistData {
  name: string;
  email: string;
  company: string;
  industry: string;
  interest: string;
}

export function WaitlistForm({ isOpen, onClose, trigger = 'homepage' }: WaitlistFormProps) {
  const [formData, setFormData] = useState<WaitlistData>({
    name: '',
    email: '',
    company: '',
    industry: '',
    interest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Required Fields",
        description: "Please fill in your name and email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          page: trigger,
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setWaitlistPosition(result.position);
        setSubmitted(true);
        
        toast({
          title: "Welcome to Harmonix!",
          description: `You're #${result.position} on our waitlist. We'll be in touch soon!`,
        });
      } else {
        throw new Error(result.message || 'Failed to join waitlist');
      }
    } catch (error) {
      console.error('Waitlist submission failed:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error joining the waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      industry: '',
      interest: ''
    });
    setSubmitted(false);
    setWaitlistPosition(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-deep-space-black border-jade-forest/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-jade-forest flex items-center gap-2">
            {submitted ? (
              <>
                <CheckCircle className="h-5 w-5 text-harmonix-gold" />
                Welcome to Harmonix!
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                Join the Waitlist
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="space-y-6 text-center py-4">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-harmonix-gold/20 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-harmonix-gold" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-jade-forest">
                  You're In!
                </h3>
                <p className="text-jade-forest/80">
                  {waitlistPosition && (
                    <span className="block text-harmonix-gold font-semibold">
                      Position #{waitlistPosition}
                    </span>
                  )}
                  We'll notify you when Harmonix launches. Get ready for AI-powered automation!
                </p>
              </div>
            </div>

            <Button 
              onClick={resetForm}
              className="w-full bg-harmonix-gold hover:bg-harmonix-gold/90 text-deep-space-black"
            >
              Continue Exploring
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Your name*"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="bg-deep-space-black/50 border-jade-forest/30 text-jade-forest placeholder:text-jade-forest/50"
              />
              
              <Input
                type="email"
                placeholder="Email address*"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="bg-deep-space-black/50 border-jade-forest/30 text-jade-forest placeholder:text-jade-forest/50"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Company (optional)"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="bg-deep-space-black/50 border-jade-forest/30 text-jade-forest placeholder:text-jade-forest/50"
              />
              
              <Input
                placeholder="Industry (optional)"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                className="bg-deep-space-black/50 border-jade-forest/30 text-jade-forest placeholder:text-jade-forest/50"
              />
            </div>
            
            <Textarea
              placeholder="What excites you most about AI automation?"
              value={formData.interest}
              onChange={(e) => setFormData(prev => ({ ...prev, interest: e.target.value }))}
              className="bg-deep-space-black/50 border-jade-forest/30 text-jade-forest placeholder:text-jade-forest/50 min-h-[80px]"
            />
            
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.email}
                className="flex-1 bg-harmonix-gold hover:bg-harmonix-gold/90 text-deep-space-black font-semibold"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-deep-space-black mr-2"></div>
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </Button>
              
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-jade-forest/30 text-jade-forest hover:bg-jade-forest/10"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}