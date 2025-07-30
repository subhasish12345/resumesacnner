
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
        toast({
            variant: 'destructive',
            title: 'No Rating Provided',
            description: 'Please select a star rating before submitting.',
        });
        return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Feedback submitted:', { rating, feedback });
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
        <Card className="w-full shadow-lg border-primary/20">
            <CardHeader className="items-center text-center">
                <CardTitle>Thank You!</CardTitle>
                <CardDescription>Your feedback has been submitted successfully.</CardDescription>
            </CardHeader>
        </Card>
    )
  }

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader className="text-center">
        <CardTitle>Enjoying the app?</CardTitle>
        <CardDescription>We'd love to hear your feedback!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={cn(
                    'w-8 h-8 cursor-pointer transition-colors',
                    star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Tell us about your experience or suggest an improvement..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="resize-y min-h-[100px]"
          />
          <div className="flex justify-center">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
