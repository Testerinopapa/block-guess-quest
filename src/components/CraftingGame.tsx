import { useState } from "react";
import { craftingRecipes, CraftingRecipe } from "@/data/craftingRecipes";
import GameCard from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, RefreshCw, CheckCircle, XCircle } from "lucide-react";

interface CraftingGameProps {
  score: number;
  onScoreChange: (newScore: number) => void;
}

export default function CraftingGame({ score, onScoreChange }: CraftingGameProps) {
  const [currentRecipe, setCurrentRecipe] = useState<CraftingRecipe | null>(null);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  const startNewRecipe = () => {
    const randomRecipe = craftingRecipes[Math.floor(Math.random() * craftingRecipes.length)];
    setCurrentRecipe(randomRecipe);
    setGuess("");
    setFeedback(null);
    setAttempts(0);
  };

  const handleSubmitGuess = () => {
    if (!currentRecipe || !guess.trim()) return;

    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedResult = currentRecipe.result.toLowerCase().trim();

    if (normalizedGuess === normalizedResult) {
      setFeedback("correct");
      onScoreChange(score + 1);
    } else {
      setFeedback("wrong");
      setAttempts(prev => prev + 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !feedback) {
      handleSubmitGuess();
    }
  };

  const gameOver = attempts >= maxAttempts;

  return (
    <div className="space-y-6">
      <GameCard className="space-y-6">
        {!currentRecipe ? (
          <div className="text-center space-y-6 py-12">
            <div className="text-6xl">⚒️</div>
            <p className="text-2xl font-bold text-muted-foreground">
              Ready to craft?
            </p>
            <Button
              onClick={startNewRecipe}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-xl font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Start Crafting!
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Crafting Grid */}
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Crafting Ingredients:</h3>
              
              {/* 3x3 Grid Visual */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-3xl shadow-xl">
                <div className="grid grid-cols-3 gap-3 w-64 h-64">
                  {Array.from({ length: 9 }).map((_, index) => {
                    const ingredient = currentRecipe.ingredients[index];
                    return (
                      <div
                        key={index}
                        className="bg-card border-2 border-primary/30 rounded-xl flex items-center justify-center p-2 text-center"
                      >
                        {ingredient && (
                          <span className="text-xs font-semibold text-foreground">
                            {ingredient}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Arrow */}
              <div className="text-4xl">⬇️</div>
              
              {/* Result Box */}
              <div className="bg-gradient-to-br from-accent/20 to-primary/20 p-4 rounded-2xl">
                <div className="w-24 h-24 bg-card border-4 border-accent rounded-xl flex items-center justify-center">
                  <span className="text-3xl">❓</span>
                </div>
              </div>
            </div>

            {/* Attempts Counter */}
            <div className="text-center">
              <p className="text-lg font-semibold text-muted-foreground">
                Attempts: {attempts}/{maxAttempts}
              </p>
            </div>

            {/* Input Section */}
            {!feedback && !gameOver && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="text"
                    placeholder="Type the result..."
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-lg px-4 py-6 rounded-xl border-2 border-primary/50 focus:border-primary"
                    autoFocus
                  />
                  <Button
                    onClick={handleSubmitGuess}
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-6 rounded-xl font-bold whitespace-nowrap"
                  >
                    Submit Guess
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Hint: Try lowercase names like "sticks" or "crafting table"
                </p>
              </div>
            )}

            {/* Correct Answer */}
            {feedback === "correct" && (
              <div className="text-center space-y-4 animate-bounce-in">
                <CheckCircle className="w-16 h-16 text-success mx-auto" />
                <p className="text-3xl md:text-4xl font-bold text-success">
                  🎉 Perfect Craft! 🎉
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  You made <span className="text-primary">{currentRecipe.result}</span>!
                </p>
                <Button
                  onClick={startNewRecipe}
                  size="lg"
                  className="bg-success hover:bg-success/90 text-success-foreground px-6 py-4 text-lg font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Next Recipe!
                </Button>
              </div>
            )}

            {/* Wrong Answer */}
            {feedback === "wrong" && !gameOver && (
              <div className="text-center space-y-4 animate-wiggle">
                <XCircle className="w-16 h-16 text-destructive mx-auto" />
                <p className="text-2xl font-bold text-destructive">
                  Not quite! Try again!
                </p>
                <Button
                  onClick={() => {
                    setFeedback(null);
                    setGuess("");
                  }}
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-4 text-lg font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Game Over */}
            {gameOver && feedback !== "correct" && (
              <div className="text-center space-y-4 animate-wiggle">
                <p className="text-3xl md:text-4xl font-bold text-destructive">
                  😅 Out of Attempts!
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  The answer was <span className="text-primary">{currentRecipe.result}</span>
                </p>
                <Button
                  onClick={startNewRecipe}
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-4 text-lg font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Another Recipe!
                </Button>
              </div>
            )}

            {/* Skip Button */}
            {!feedback && !gameOver && (
              <div className="text-center">
                <Button
                  onClick={startNewRecipe}
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 rounded-xl font-bold"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Skip Recipe
                </Button>
              </div>
            )}
          </div>
        )}
      </GameCard>
    </div>
  );
}
