import { Trophy } from "lucide-react";

interface ScoreBadgeProps {
  score: number;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  return (
    <div className="bg-accent text-accent-foreground px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce-in">
      <Trophy className="w-6 h-6" />
      <span className="font-bold text-xl">{score}</span>
    </div>
  );
}
