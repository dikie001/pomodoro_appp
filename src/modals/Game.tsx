import { Crown, Flame, Target, Zap } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

const NeonReactionBlaster = () => {  
  const [gameState, setGameState] = useState<
    "menu" | "countdown" | "playing" | "gameOver"
  >("menu");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage?.getItem?.("reactionBlasterBest") || "0";
    return parseInt(saved);
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<   
    Array<{
      id: number;
      x: number;    
      y: number;
      type: "normal" | "bonus" | "bomb";
      scale: number;
      rotation: number;
    }>
  >([]);
  const [countdown, setCountdown] = useState(3);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }>
  >([]);

  const colors = {
    normal: ["from-cyan-400", "to-blue-500", "shadow-cyan-500/50"],
    bonus: ["from-yellow-400", "to-orange-500", "shadow-yellow-500/50"],
    bomb: ["from-red-500", "to-pink-600", "shadow-red-500/50"],
  };

  const createParticles = (x: number, y: number, color: string, count = 8) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        color,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const spawnTarget = useCallback(() => {
    const gameArea = document.getElementById("game-area");
    if (!gameArea) return;

    const rect = gameArea.getBoundingClientRect();
    const margin = 60;

    const rand = Math.random();
    let type: "normal" | "bonus" | "bomb" = "normal";

    if (rand < 0.1) type = "bomb";
    else if (rand < 0.25) type = "bonus";

    const newTarget = {
      id: Date.now() + Math.random(),
      x: margin + Math.random() * (rect.width - margin * 2),
      y: margin + Math.random() * (rect.height - margin * 2),
      type,
      scale: 0,
      rotation: Math.random() * 360,
    };

    setTargets((prev) => [...prev, newTarget]);

    // Animate target in
    setTimeout(() => {
      setTargets((prev) =>
        prev.map((t) => (t.id === newTarget.id ? { ...t, scale: 1 } : t))
      );
    }, 10);

    // Remove target after timeout
    setTimeout(
      () => {
        setTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
        if (type === "normal" || type === "bonus") {
          setCombo(0); // Break combo if target expires
        }
      },
      type === "bonus" ? 1500 : type === "bomb" ? 3000 : 2000
    );
  }, []);

  const handleTargetClick = (target: any, event: React.MouseEvent) => {
    event.stopPropagation();

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (target.type === "bomb") {
      // Hit bomb - lose points and break combo
      setScore((prev) => Math.max(0, prev - 50));
      setCombo(0);
      createParticles(x, y, "#ef4444", 12);
      setTargets((prev) => prev.filter((t) => t.id !== target.id));
      return;
    }

    // Hit good target
    const newCombo = combo + 1;
    setCombo(newCombo);

    let points = target.type === "bonus" ? 25 : 10;
    points *= Math.floor(newCombo / 5) + 1; // Combo multiplier every 5 hits

    setScore((prev) => prev + points);
    createParticles(x, y, target.type === "bonus" ? "#facc15" : "#06b6d4", 10);

    setTargets((prev) => prev.filter((t) => t.id !== target.id));
  };

  const startGame = () => {
    setGameState("countdown");
    setScore(0);
    setCombo(0);
    setTimeLeft(30);
    setTargets([]);
    setCountdown(3);
  };

  const endGame = () => {
    setGameState("gameOver");
    setTargets([]);
    if (score > bestScore) {
      setBestScore(score);
      localStorage?.setItem?.("reactionBlasterBest", score.toString());
    }
  };

  // Countdown effect
  useEffect(() => {
    if (gameState === "countdown") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setGameState("playing");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  // Game timer
  useEffect(() => {
    if (gameState === "playing") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, score, bestScore]);

  // Target spawning
  useEffect(() => {
    if (gameState === "playing") {
      const spawnRate = Math.max(800 - score / 10, 400); // Faster spawning as score increases
      const spawner = setInterval(spawnTarget, spawnRate);
      return () => clearInterval(spawner);
    }
  }, [gameState, spawnTarget, score]);

  // Particle animation
  useEffect(() => {
    if (particles.length > 0) {
      const animator = setInterval(() => {
        setParticles((prev) =>
          prev
            .map((p) => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vx: p.vx * 0.98,
              vy: p.vy * 0.98,
              life: p.life - 0.05,
            }))
            .filter((p) => p.life > 0)
        );
      }, 16);
      return () => clearInterval(animator);
    }
  }, [particles.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

      {gameState === "menu" && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-8 p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Zap className="w-12 h-12 text-yellow-400 animate-pulse" />
                <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  NEON BLASTER
                </h1>
                <Target className="w-12 h-12 text-cyan-400 animate-spin" />
              </div>
              <p className="text-xl text-gray-300 max-w-md">
                Blast targets as fast as you can! Avoid bombs, hit bonuses,
                build combos!
              </p>
            </div>

            <div className="flex justify-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                <span className="text-cyan-300">Normal +10pts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                <span className="text-yellow-300">Bonus +25pts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full"></div>
                <span className="text-red-300">Bomb -50pts</span>
              </div>
            </div>

            <div className="text-center text-gray-400">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span>Best Score: {bestScore}</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-2xl font-bold rounded-2xl transform hover:scale-110 transition-all duration-200 shadow-2xl shadow-cyan-500/25 animate-pulse"
            >
              START BLASTING
            </button>
          </div>
        </div>
      )}

      {gameState === "countdown" && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-9xl font-black text-white animate-bounce">
            {countdown}
          </div>
        </div>
      )}

      {gameState === "playing" && (
        <div className="relative h-screen">
          {/* HUD */}
          <div className="absolute top-0 left-0 right-0 z-20 p-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-6">
                <div className="bg-black/30 backdrop-blur-xl rounded-2xl px-4 py-2 border border-cyan-500/30">
                  <div className="text-cyan-400 text-sm">SCORE</div>
                  <div className="text-2xl font-bold text-white">{score}</div>
                </div>
                <div className="bg-black/30 backdrop-blur-xl rounded-2xl px-4 py-2 border border-purple-500/30">
                  <div className="text-purple-400 text-sm">COMBO</div>
                  <div className="text-2xl font-bold text-white">
                    x{Math.floor(combo / 5) + 1}
                    <span className="text-sm text-gray-400 ml-1">
                      ({combo})
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-black/30 backdrop-blur-xl rounded-2xl px-4 py-2 border border-yellow-500/30">
                <div className="text-yellow-400 text-sm">TIME</div>
                <div className="text-2xl font-bold text-white">{timeLeft}s</div>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <div
            id="game-area"
            className="absolute inset-0 cursor-crosshair"
            onClick={() => setCombo(0)} // Break combo on miss
          >
            {targets.map((target) => (
              <button
                key={target.id}
                onClick={(e) => handleTargetClick(target, e)}
                className={`absolute w-16 h-16 rounded-full border-4 border-white/20 transition-all duration-200 cursor-pointer hover:scale-110 bg-gradient-to-br ${
                  colors[target.type][0]
                } ${colors[target.type][1]} shadow-2xl ${
                  colors[target.type][2]
                }`}
                style={{
                  left: target.x - 32,
                  top: target.y - 32,
                  transform: `scale(${target.scale}) rotate(${target.rotation}deg)`,
                  animation:
                    target.type === "bomb" ? "pulse 0.5s infinite" : "none",
                }}
              >
                {target.type === "normal" && (
                  <Target className="w-8 h-8 text-white m-auto" />
                )}
                {target.type === "bonus" && (
                  <Flame className="w-8 h-8 text-white m-auto" />
                )}
                {target.type === "bomb" && <span className="text-2xl">💣</span>}
              </button>
            ))}

            {/* Particles */}
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 rounded-full pointer-events-none"
                style={{
                  left: particle.x,
                  top: particle.y,
                  backgroundColor: particle.color,
                  opacity: particle.life,
                  boxShadow: `0 0 10px ${particle.color}`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {gameState === "gameOver" && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 p-8">
            <h2 className="text-5xl font-bold text-white mb-4">GAME OVER</h2>
            <div className="space-y-4">
              <div className="text-3xl">
                <span className="text-gray-400">Final Score: </span>
                <span className="text-cyan-400 font-bold">{score}</span>
              </div>
              {score > bestScore && (
                <div className="text-2xl text-yellow-400 animate-pulse">
                  🏆 NEW BEST SCORE! 🏆
                </div>
              )}
              <div className="text-xl text-gray-400">Best: {bestScore}</div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white text-xl font-bold rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={() => setGameState("menu")}
                className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white text-xl font-bold rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeonReactionBlaster;
