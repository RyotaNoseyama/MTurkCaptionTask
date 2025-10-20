'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CaptionFormProps {
  onSubmit: (captions: { a: string; b: string }, rtMs: number) => Promise<void>;
  disabled?: boolean;
}

const MIN_LENGTH = 30;
const MAX_LENGTH = 1000;

export function CaptionForm({ onSubmit, disabled }: CaptionFormProps) {
  const [captionA, setCaptionA] = useState('');
  const [captionB, setCaptionB] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  const isValidLength = (text: string) => text.length >= MIN_LENGTH && text.length <= MAX_LENGTH;
  const canSubmit = isValidLength(captionA) && isValidLength(captionB) && !disabled && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const rtMs = Date.now() - startTime;
      await onSubmit({ a: captionA, b: captionB }, rtMs);
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">Write Your Captions</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="captionA" className="text-sm font-medium text-slate-700">
                Caption A
              </Label>
              <span className={`text-xs ${isValidLength(captionA) ? 'text-green-600' : 'text-slate-500'}`}>
                {captionA.length} / {MIN_LENGTH} min
              </span>
            </div>
            <Textarea
              id="captionA"
              value={captionA}
              onChange={(e) => setCaptionA(e.target.value)}
              placeholder="Write a detailed description of the image..."
              className="min-h-[120px] resize-none border-slate-300 focus:border-slate-400 focus:ring-slate-400"
              disabled={disabled || isSubmitting}
              maxLength={MAX_LENGTH}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="captionB" className="text-sm font-medium text-slate-700">
                Caption B
              </Label>
              <span className={`text-xs ${isValidLength(captionB) ? 'text-green-600' : 'text-slate-500'}`}>
                {captionB.length} / {MIN_LENGTH} min
              </span>
            </div>
            <Textarea
              id="captionB"
              value={captionB}
              onChange={(e) => setCaptionB(e.target.value)}
              placeholder="Write a second detailed description of the image..."
              className="min-h-[120px] resize-none border-slate-300 focus:border-slate-400 focus:ring-slate-400"
              disabled={disabled || isSubmitting}
              maxLength={MAX_LENGTH}
            />
          </div>

          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-slate-700 hover:bg-slate-800 text-white disabled:bg-slate-300 disabled:text-slate-500"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Captions'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
