interface LetterButtonProps {
  letter: string;
  onClick: () => void;
  disabled: boolean;
  isGuessed: boolean;
}

export default function LetterButton({ letter, onClick, disabled, isGuessed }: LetterButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-3 rounded-xl font-bold text-lg transition-all duration-200
        ${
          isGuessed
            ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            : "bg-primary text-primary-foreground hover:scale-110 hover:shadow-lg active:scale-95 shadow-md"
        }
        ${!isGuessed && !disabled ? "animate-bounce-in" : ""}
      `}
    >
      {letter.toUpperCase()}
    </button>
  );
}
