"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageDisplay } from "./image-display";
import {
  countNonWhitespaceCharacters,
  isValidNonWhitespaceLength,
} from "@/lib/text-utils";

interface CaptionFormProps {
  onSubmit: (caption: string, rtMs: number) => Promise<void>;
  disabled?: boolean;
  imageUrl?: string;
}

const MIN_LENGTH = 30;
const MAX_LENGTH = 1000;

export function CaptionForm({
  onSubmit,
  disabled,
  imageUrl,
}: CaptionFormProps) {
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [showCaptionError, setShowCaptionError] = useState(false);

  const isValidLength = (text: string) =>
    isValidNonWhitespaceLength(text, MIN_LENGTH, MAX_LENGTH);
  const isTooShort = (text: string) =>
    countNonWhitespaceCharacters(text) > 0 &&
    countNonWhitespaceCharacters(text) < MIN_LENGTH;
  const canSubmit = isValidLength(caption) && !disabled && !isSubmitting;

  const handleCaptionBlur = () => {
    if (isTooShort(caption)) {
      setShowCaptionError(true);
    } else {
      setShowCaptionError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const rtMs = Date.now() - startTime;
      await onSubmit(caption, rtMs);
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Write Your Caption
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 画像表示エリア */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Image</Label>
            <ImageDisplay imageUrl={imageUrl} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="caption"
                className="text-sm font-medium text-slate-700"
              >
                Caption
              </Label>
              <span
                className={`text-xs ${
                  isValidLength(caption) ? "text-green-600" : "text-slate-500"
                }`}
              >
                {countNonWhitespaceCharacters(caption)} / {MIN_LENGTH} min
              </span>
            </div>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onBlur={handleCaptionBlur}
              placeholder="Write a detailed description of the image..."
              className={`min-h-[120px] resize-none focus:ring-slate-400 ${
                isTooShort(caption)
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-400"
              }`}
              disabled={disabled || isSubmitting}
              maxLength={MAX_LENGTH}
            />
            {showCaptionError && (
              <p className="text-red-500 text-xs mt-1">
                Caption needs at least {MIN_LENGTH} characters (excluding
                spaces). Current: {countNonWhitespaceCharacters(caption)}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-slate-700 hover:bg-slate-800 text-white disabled:bg-slate-300 disabled:text-slate-500"
          >
            {isSubmitting ? "Submitting..." : "Submit Caption"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
