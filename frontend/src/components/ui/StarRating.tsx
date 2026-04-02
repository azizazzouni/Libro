import { Star } from 'lucide-react';

interface Props {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}

export function StarRating({ rating, max = 5, size = 16, interactive = false, onChange }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${i < Math.round(rating) ? 'text-gold fill-gold' : 'text-ink-200'} ${interactive ? 'cursor-pointer hover:text-gold hover:fill-gold transition-colors' : ''}`}
          onClick={() => interactive && onChange?.(i + 1)}
        />
      ))}
    </div>
  );
}
