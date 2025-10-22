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
  onSubmit: (captions: { a: string; b: string }, rtMs: number) => Promise<void>;
  disabled?: boolean;
  imageUrlA?: string;
  imageUrlB?: string;
}

const MIN_LENGTH = 30;
const MAX_LENGTH = 1000;

export function CaptionForm({ onSubmit, disabled, imageUrlA, imageUrlB }: CaptionFormProps) {
  const [captionA, setCaptionA] = useState("");
  const [captionB, setCaptionB] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [showCaptionAError, setShowCaptionAError] = useState(false);
  const [showCaptionBError, setShowCaptionBError] = useState(false);

  const isValidLength = (text: string) =>
    isValidNonWhitespaceLength(text, MIN_LENGTH, MAX_LENGTH);
  const isTooShort = (text: string) =>
    countNonWhitespaceCharacters(text) > 0 &&
    countNonWhitespaceCharacters(text) < MIN_LENGTH;
  const canSubmit =
    isValidLength(captionA) &&
    isValidLength(captionB) &&
    !disabled &&
    !isSubmitting;

  const handleCaptionABlur = () => {
    if (isTooShort(captionA)) {
      setShowCaptionAError(true);
    } else {
      setShowCaptionAError(false);
    }
  };

  const handleCaptionBBlur = () => {
    if (isTooShort(captionB)) {
      setShowCaptionBError(true);
    } else {
      setShowCaptionBError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const rtMs = Date.now() - startTime;
      await onSubmit({ a: captionA, b: captionB }, rtMs);
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Write Your Captions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 画像表示エリアA */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Image A
            </Label>
            <ImageDisplay imageUrl={imageUrlA} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="captionA"
                className="text-sm font-medium text-slate-700"
              >
                Caption A
              </Label>
              <span
                className={`text-xs ${
                  isValidLength(captionA) ? "text-green-600" : "text-slate-500"
                }`}
              >
                {countNonWhitespaceCharacters(captionA)} / {MIN_LENGTH} min
              </span>
            </div>
            <Textarea
              id="captionA"
              value={captionA}
              onChange={(e) => setCaptionA(e.target.value)}
              onBlur={handleCaptionABlur}
              placeholder="Write a detailed description of Image A..."
              className={`min-h-[120px] resize-none focus:ring-slate-400 ${
                isTooShort(captionA)
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-400"
              }`}
              disabled={disabled || isSubmitting}
              maxLength={MAX_LENGTH}
            />
            {showCaptionAError && (
              <p className="text-red-500 text-xs mt-1">
                Caption A needs at least {MIN_LENGTH} characters (excluding
                spaces). Current: {countNonWhitespaceCharacters(captionA)}
              </p>
            )}
          </div>

          {/* 画像表示エリアB */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Image B
            </Label>
            <ImageDisplay imageUrl={imageUrlB} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="captionB"
                className="text-sm font-medium text-slate-700"
              >
                Caption B
              </Label>
              <span
                className={`text-xs ${
                  isValidLength(captionB) ? "text-green-600" : "text-slate-500"
                }`}
              >
                {countNonWhitespaceCharacters(captionB)} / {MIN_LENGTH} min
              </span>
            </div>
            <Textarea
              id="captionB"
              value={captionB}
              onChange={(e) => setCaptionB(e.target.value)}
              onBlur={handleCaptionBBlur}
              placeholder="Write a detailed description of Image B..."
              className={`min-h-[120px] resize-none focus:ring-slate-400 ${
                isTooShort(captionB)
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-400"
              }`}
              disabled={disabled || isSubmitting}
              maxLength={MAX_LENGTH}
            />
            {showCaptionBError && (
              <p className="text-red-500 text-xs mt-1">
                Caption B needs at least {MIN_LENGTH} characters (excluding
                spaces). Current: {countNonWhitespaceCharacters(captionB)}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-slate-700 hover:bg-slate-800 text-white disabled:bg-slate-300 disabled:text-slate-500"
          >
            {isSubmitting ? "Submitting..." : "Submit Captions"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
