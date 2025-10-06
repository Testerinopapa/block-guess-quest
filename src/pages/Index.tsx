import { useState, useEffect } from "react";
import JSZip from "jszip";
import GameCard from "@/components/GameCard";
import LetterButton from "@/components/LetterButton";
import Hearts from "@/components/Hearts";
import ScoreBadge from "@/components/ScoreBadge";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";

interface Block {
  raw: string;
  name: string;
  image: string;
}

const Index = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [block, setBlock] = useState<Block | null>(null);
  const [maskedName, setMaskedName] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const maxTries = 6;

  const formatName = (raw: string) => {
    return raw
      .replace(/^minecraft_/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  useEffect(() => {
    fetch("/blocks.zip")
      .then((res) => res.arrayBuffer())
      .then((data) => JSZip.loadAsync(data))
      .then((zip) => {
        const items: Promise<Block>[] = [];
        zip.forEach((relativePath, file) => {
          if (!file.dir) {
            let rawName = relativePath.replace(/\.[^/.]+$/, "").toLowerCase();
            rawName = rawName.replace(/^minecraft_/, "");
            items.push(
              file.async("base64").then((content) => ({
                raw: rawName,
                name: formatName(rawName),
                image: `data:image/png;base64,${content}`,
              }))
            );
          }
        });
        return Promise.all(items);
      })
      .then(setBlocks);
  }, []);

  const rollBlock = () => {
    if (!blocks.length) return;
    const randomBlock = blocks[Math.floor(Math.random() * blocks.length)];
    setBlock(randomBlock);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setMaskedName(randomBlock.raw.replace(/./g, (c) => (c === " " ? " " : "_")));
  };

  const guessLetter = (letter: string) => {
    if (!block || guessedLetters.includes(letter) || wrongGuesses >= maxTries) return;

    const newGuesses = [...guessedLetters, letter];
    setGuessedLetters(newGuesses);

    if (block.raw.includes(letter)) {
      let updatedMask = "";
      for (let i = 0; i < block.raw.length; i++) {
        const char = block.raw[i];
        updatedMask += newGuesses.includes(char) || char === " " ? char : "_";
      }
      setMaskedName(updatedMask);

      if (updatedMask === block.raw) {
        setScore((prev) => prev + 1);
      }
    } else {
      setWrongGuesses((prev) => prev + 1);
    }
  };

  const gameOver = wrongGuesses >= maxTries;
  const won = block && maskedName === block.raw;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-primary/20 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-black text-foreground drop-shadow-lg">
            🧱 Guess the Block! 🎮
          </h1>
          <p className="text-xl text-muted-foreground font-semibold">
            Can you guess the Minecraft block?
          </p>
        </div>

        {/* Score Badge */}
        <div className="flex justify-center">
          <ScoreBadge score={score} />
        </div>

        {/* Main Game Card */}
        <GameCard className="space-y-6">
          {!block ? (
            <div className="text-center space-y-6 py-12">
              <div className="text-6xl">🎲</div>
              <p className="text-2xl font-bold text-muted-foreground">
                Ready to play?
              </p>
              <Button
                onClick={rollBlock}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-xl font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                Start Game!
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Block Image */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-3xl shadow-xl">
                  <img
                    src={block.image}
                    alt="Mystery Block"
                    className="w-32 h-32 md:w-40 md:h-40 pixelated"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              </div>

              {/* Masked Name */}
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-mono font-bold tracking-[0.5em] text-foreground">
                  {maskedName.split("").join(" ")}
                </p>
              </div>

              {/* Hearts */}
              <Hearts total={maxTries} remaining={maxTries - wrongGuesses} />

              {/* Letter Keyboard */}
              <div className="grid grid-cols-7 gap-2 max-w-2xl mx-auto">
                {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
                  <LetterButton
                    key={letter}
                    letter={letter}
                    onClick={() => guessLetter(letter)}
                    disabled={gameOver || won}
                    isGuessed={guessedLetters.includes(letter)}
                  />
                ))}
              </div>

              {/* Win Message */}
              {won && (
                <div className="text-center space-y-4 animate-bounce-in">
                  <p className="text-3xl md:text-4xl font-bold text-success">
                    🎉 Awesome! You got it! 🎉
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    It's <span className="text-primary">{block.name}</span>!
                  </p>
                  <Button
                    onClick={rollBlock}
                    size="lg"
                    className="bg-success hover:bg-success/90 text-success-foreground px-6 py-4 text-lg font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Next Block!
                  </Button>
                </div>
              )}

              {/* Game Over Message */}
              {gameOver && !won && (
                <div className="text-center space-y-4 animate-wiggle">
                  <p className="text-3xl md:text-4xl font-bold text-destructive">
                    😅 Oops! Try Again!
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    It was <span className="text-primary">{block.name}</span>
                  </p>
                  <Button
                    onClick={rollBlock}
                    size="lg"
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-4 text-lg font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Try Another!
                  </Button>
                </div>
              )}

              {/* Next Block Button (during active game) */}
              {!won && !gameOver && (
                <div className="text-center">
                  <Button
                    onClick={rollBlock}
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 rounded-xl font-bold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Skip This Block
                  </Button>
                </div>
              )}
            </div>
          )}
        </GameCard>
      </div>
    </div>
  );
};

export default Index;
