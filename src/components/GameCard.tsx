import { ReactNode } from "react";

interface GameCardProps {
  children: ReactNode;
  className?: string;
}

export default function GameCard({ children, className = "" }: GameCardProps) {
  return (
    <div className={`bg-card rounded-3xl shadow-2xl p-8 ${className}`}>
      {children}
    </div>
  );
}
