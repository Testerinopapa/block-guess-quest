import { Heart } from "lucide-react";

interface HeartsProps {
  total: number;
  remaining: number;
}

export default function Hearts({ total, remaining }: HeartsProps) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <Heart
          key={i}
          className={`w-8 h-8 transition-all duration-300 ${
            i < remaining
              ? "fill-destructive text-destructive animate-pop"
              : "fill-muted text-muted opacity-30"
          }`}
        />
      ))}
    </div>
  );
}
