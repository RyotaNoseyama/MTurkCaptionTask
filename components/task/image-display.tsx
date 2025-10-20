import { Card } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';

interface ImageDisplayProps {
  imageUrl?: string;
}

export function ImageDisplay({ imageUrl }: ImageDisplayProps) {
  if (!imageUrl) {
    return (
      <Card className="flex items-center justify-center h-96 bg-slate-100 border-slate-200">
        <div className="text-center text-slate-400">
          <ImageIcon className="mx-auto h-16 w-16 mb-2" />
          <p className="text-sm">Image will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-slate-200">
      <div className="relative w-full h-96">
        <img
          src={imageUrl}
          alt="Task image"
          className="w-full h-full object-contain"
        />
      </div>
    </Card>
  );
}
