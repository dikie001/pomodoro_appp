import React, { useState, useEffect, useCallback, useRef } from "react";
import { Shield, Zap, Star, Skull, Crown, Play } from "lucide-react";

const CyberDodgeArena = () => {
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">(
    "menu"
  );
  const [player, setPlayer] = useState({ x: 250, y: 250 });
  const [enemies, setEnemies] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      type: "basic" | "fast" | "homing" | "boss";
      size: number;
      health?: number;
    }>
  >([]);
  const [powerups, setPowerups] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      type: "shield" | "slow" | "points";
      rotation: number;
    }>
  >([]);
  const [bullets, setBullets] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
    }>
  >([]);
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;
    }>
  >([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage?.getItem?.("cyberDodgeBest") || "0";
    return parseInt(saved);
  });
  const [shield, setShield] = useState(false);
  const [slowMotion, setSlowMotion] = useState(false);
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const mouseRef = useRef({ x: 0, y: 0 });

  const GAME_WIDTH = 600;
  const GAME_HEIGHT = 400;

  const createParticles = (x: number, y: number, color: string, count = 8) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        color,
        size: Math.random() * 4 + 2,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const spawnEnemy = useCallback(() => {
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;

    switch (side) {
      case 0: // top
        x = Math.random() * GAME_WIDTH;
        y = -20;
        vx = (Math.random() - 0.5) * 2;
        vy = Math.random() * 2 + 1;
        break;
      case 1: // right
        x = GAME_WIDTH + 20;
        y = Math.random() * GAME_HEIGHT;
        vx = -(Math.random() * 2 + 1);
        vy = (Math.random() - 0.5) * 2;
        break;
      case 2: // bottom
        x = Math.random() * GAME_WIDTH;
        y = GAME_HEIGHT + 20;
        vx = (Math.random() - 0.5) * 2;
        vy = -(Math.random() * 2 + 1);
        break;
      default: // left
        x = -20;
        y = Math.random() * GAME_HEIGHT;
        vx = Math.random() * 2 + 1;
        vy = (Math.random() - 0.5) * 2;
    }

    const rand = Math.random();
    let type: "basic" | "fast" | "homing" | "boss" = "basic";
    let size = 12;
    let health = 1;

    if (wave >= 5 && rand < 0.1) {
      type = "boss";
      size = 24;
      health = 3;
    } else if (rand < 0.2) {
      type = "homing";
      size = 10;
    } else if (rand < 0.4) {
      type = "fast";
      size = 8;
      vx *= 2;
      vy *= 2;
    }

    const newEnemy = {
      id: Date.now() + Math.random(),
      x,
      y,
      vx,
      vy,
      type,
      size,
      health,
    };

    setEnemies((prev) => [...prev, newEnemy]);
  }, [wave]);

  const spawnPowerup = useCallback(() => {
    if (Math.random() < 0.7) return; // 30% chance

    const types = ["shield", "slow", "points"];
    const type = types[Math.floor(Math.random() * types.length)] as
      | "shield"
      | "slow"
      | "points";

    const newPowerup = {
      id: Date.now() + Math.random(),
      x: Math.random() * (GAME_WIDTH - 40) + 20,
      y: Math.random() * (GAME_HEIGHT - 40) + 20,
      type,
      rotation: 0,
    };

    setPowerups((prev) => [...prev, newPowerup]);
  }, []);

  const shoot = useCallback(
    (targetX: number, targetY: number) => {
      const dx = targetX - player.x;
      const dy = targetY - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) return;

      const speed = 8;
      const vx = (dx / distance) * speed;
      const vy = (dy / distance) * speed;

      const newBullet = {
        id: Date.now() + Math.random(),
        x: player.x,
        y: player.y,
        vx,
        vy,
      };

      setBullets((prev) => [...prev, newBullet]);
      createParticles(player.x, player.y, "#00ffff", 3);
    },
    [player.x, player.y]
  );

  const startGame = () => {
    setGameState("playing");
    setPlayer({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
    setEnemies([]);
    setPowerups([]);
    setBullets([]);
    setParticles([]);
    setScore(0);
    setWave(1);
    setLives(3);
    setShield(false);
    setSlowMotion(false);
  };

  const endGame = () => {
    setGameState("gameOver");
    if (score > bestScore) {
      setBestScore(score);
      localStorage?.setItem?.("cyberDodgeBest", score.toString());
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (gameState === "playing" && gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const targetX = e.clientX - rect.left;
        const targetY = e.clientY - rect.top;
        shoot(targetX, targetY);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [gameState, shoot]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = setInterval(() => {
      const speed = slowMotion ? 2 : 4;

      // Move player
      setPlayer((prev) => {
        let { x, y } = prev;

        if (keysRef.current.has("w") || keysRef.current.has("arrowup"))
          y -= speed;
        if (keysRef.current.has("s") || keysRef.current.has("arrowdown"))
          y += speed;
        if (keysRef.current.has("a") || keysRef.current.has("arrowleft"))
          x -= speed;
        if (keysRef.current.has("d") || keysRef.current.has("arrowright"))
          x += speed;

        x = Math.max(15, Math.min(GAME_WIDTH - 15, x));
        y = Math.max(15, Math.min(GAME_HEIGHT - 15, y));

        return { x, y };
      });

      // Move enemies
      setEnemies((prev) =>
        prev
          .map((enemy) => {
            let { x, y, vx, vy } = enemy;

            if (enemy.type === "homing") {
              const dx = player.x - x;
              const dy = player.y - y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance > 0) {
                const homingForce = 0.3;
                vx += (dx / distance) * homingForce;
                vy += (dy / distance) * homingForce;

                const maxSpeed = slowMotion ? 1.5 : 3;
                const currentSpeed = Math.sqrt(vx * vx + vy * vy);
                if (currentSpeed > maxSpeed) {
                  vx = (vx / currentSpeed) * maxSpeed;
                  vy = (vy / currentSpeed) * maxSpeed;
                }
              }
            }

            const moveMultiplier = slowMotion ? 0.5 : 1;
            x += vx * moveMultiplier;
            y += vy * moveMultiplier;

            return { ...enemy, x, y, vx, vy };
          })
          .filter(
            (enemy) =>
              enemy.x > -50 &&
              enemy.x < GAME_WIDTH + 50 &&
              enemy.y > -50 &&
              enemy.y < GAME_HEIGHT + 50
          )
      );

      // Move bullets
      setBullets((prev) =>
        prev
          .map((bullet) => ({
            ...bullet,
            x: bullet.x + bullet.vx,
            y: bullet.y + bullet.vy,
          }))
          .filter(
            (bullet) =>
              bullet.x > 0 &&
              bullet.x < GAME_WIDTH &&
              bullet.y > 0 &&
              bullet.y < GAME_HEIGHT
          )
      );

      // Bullet-enemy collisions
      setBullets((prevBullets) => {
        const remainingBullets = [...prevBullets];

        setEnemies((prevEnemies) => {
          const remainingEnemies = [];

          for (const enemy of prevEnemies) {
            let enemyHit = false;

            for (let i = remainingBullets.length - 1; i >= 0; i--) {
              const bullet = remainingBullets[i];
              const dx = bullet.x - enemy.x;
              const dy = bullet.y - enemy.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < enemy.size) {
                remainingBullets.splice(i, 1);
                enemyHit = true;

                enemy.health = (enemy.health || 1) - 1;
                createParticles(enemy.x, enemy.y, "#ff4444", 6);

                if (enemy.health <= 0) {
                  let points = 10;
                  if (enemy.type === "fast") points = 15;
                  else if (enemy.type === "homing") points = 25;
                  else if (enemy.type === "boss") points = 50;

                  setScore((prev) => prev + points);
                  createParticles(enemy.x, enemy.y, "#ffff00", 12);
                } else {
                  remainingEnemies.push(enemy);
                }
                break;
              }
            }

            if (!enemyHit) {
              remainingEnemies.push(enemy);
            }
          }

          return remainingEnemies;
        });

        return remainingBullets;
      });

      // Player-enemy collisions
      setEnemies((prevEnemies) => {
        for (const enemy of prevEnemies) {
          const dx = player.x - enemy.x;
          const dy = player.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < enemy.size + 12) {
            if (shield) {
              setShield(false);
              createParticles(player.x, player.y, "#00ffff", 10);
              return prevEnemies.filter((e) => e.id !== enemy.id);
            } else {
              setLives((prev) => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                  endGame();
                }
                return newLives;
              });
              createParticles(player.x, player.y, "#ff0000", 15);
              return prevEnemies.filter((e) => e.id !== enemy.id);
            }
          }
        }
        return prevEnemies;
      });

      // Player-powerup collisions
      setPowerups((prevPowerups) => {
        const remaining = [];
        for (const powerup of prevPowerups) {
          const dx = player.x - powerup.x;
          const dy = player.y - powerup.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 20) {
            createParticles(powerup.x, powerup.y, "#00ff00", 8);

            switch (powerup.type) {
              case "shield":
                setShield(true);
                setTimeout(() => setShield(false), 5000);
                break;
              case "slow":
                setSlowMotion(true);
                setTimeout(() => setSlowMotion(false), 3000);
                break;
              case "points":
                setScore((prev) => prev + 100);
                break;
            }
          } else {
            remaining.push({ ...powerup, rotation: powerup.rotation + 5 });
          }
        }
        return remaining;
      });

      // Update particles
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vx: p.vx * 0.98,
            vy: p.vy * 0.98,
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
      );

      // Score increases over time
      setScore((prev) => prev + 1);

      // Wave progression
      setWave((prev) => Math.floor(score / 500) + 1);
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, player.x, player.y, shield, slowMotion, score, bestScore]);

  // Enemy spawning
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnRate = Math.max(2000 - wave * 200, 800);
    const spawner = setInterval(() => {
      spawnEnemy();
      spawnPowerup();
    }, spawnRate);

    return () => clearInterval(spawner);
  }, [gameState, wave, spawnEnemy, spawnPowerup]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      {gameState === "menu" && (
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              CYBER DODGE
            </h1>
            <p className="text-xl text-gray-300">
              Survive the digital onslaught!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-cyan-400 font-semibold">MOVEMENT</div>
              <div className="text-gray-300">WASD / Arrow Keys</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-cyan-400 font-semibold">SHOOT</div>
              <div className="text-gray-300">Click to aim & fire</div>
            </div>
          </div>

          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300">Shield</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300">Slow Motion</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-green-400" />
              <span className="text-green-300">Bonus Points</span>
            </div>
          </div>

          <div className="text-gray-400">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span>Best Score: {bestScore}</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-2xl font-bold rounded-2xl transform hover:scale-110 transition-all duration-200 shadow-2xl"
          >
            <Play className="inline w-6 h-6 mr-2" />
            ENTER ARENA
          </button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="relative">
          {/* HUD */}
          <div className="absolute -top-16 left-0 right-0 flex justify-between items-center z-10">
            <div className="flex gap-4">
              <div className="bg-black/50 rounded-lg px-3 py-1">
                <span className="text-cyan-400">Score: </span>
                <span className="text-white font-bold">{score}</span>
              </div>
              <div className="bg-black/50 rounded-lg px-3 py-1">
                <span className="text-purple-400">Wave: </span>
                <span className="text-white font-bold">{wave}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: lives }, (_, i) => (
                <div key={i} className="w-6 h-6 bg-red-500 rounded-full"></div>
              ))}
            </div>
          </div>

          {/* Game Area */}
          <div
            ref={gameAreaRef}
            className="relative bg-gradient-to-br from-gray-800/50 to-blue-900/50 backdrop-blur-xl border-2 border-cyan-400/30 rounded-2xl overflow-hidden cursor-crosshair"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          >
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #00ffff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Player */}
            <div
              className={`absolute w-6 h-6 rounded-full transition-all duration-100 ${
                shield
                  ? "bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse"
                  : "bg-white"
              }`}
              style={{
                left: player.x - 12,
                top: player.y - 12,
                filter: shield ? "drop-shadow(0 0 10px #00ffff)" : "none",
              }}
            />

            {/* Enemies */}
            {enemies.map((enemy) => (
              <div
                key={enemy.id}
                className={`absolute rounded-full transition-all duration-100 ${
                  enemy.type === "basic"
                    ? "bg-red-500"
                    : enemy.type === "fast"
                    ? "bg-orange-500"
                    : enemy.type === "homing"
                    ? "bg-purple-500"
                    : "bg-red-700"
                }`}
                style={{
                  left: enemy.x - enemy.size,
                  top: enemy.y - enemy.size,
                  width: enemy.size * 2,
                  height: enemy.size * 2,
                  boxShadow: `0 0 15px ${
                    enemy.type === "basic"
                      ? "#ef4444"
                      : enemy.type === "fast"
                      ? "#f97316"
                      : enemy.type === "homing"
                      ? "#a855f7"
                      : "#dc2626"
                  }`,
                  filter: slowMotion ? "blur(1px)" : "none",
                }}
              >
                {enemy.type === "boss" && (
                  <Skull className="w-full h-full text-white p-1" />
                )}
              </div>
            ))}

            {/* Powerups */}
            {powerups.map((powerup) => (
              <div
                key={powerup.id}
                className={`absolute w-8 h-8 rounded-lg flex items-center justify-center ${
                  powerup.type === "shield"
                    ? "bg-cyan-500"
                    : powerup.type === "slow"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{
                  left: powerup.x - 16,
                  top: powerup.y - 16,
                  transform: `rotate(${powerup.rotation}deg)`,
                  boxShadow: `0 0 10px ${
                    powerup.type === "shield"
                      ? "#06b6d4"
                      : powerup.type === "slow"
                      ? "#eab308"
                      : "#10b981"
                  }`,
                }}
              >
                {powerup.type === "shield" && (
                  <Shield className="w-5 h-5 text-white" />
                )}
                {powerup.type === "slow" && (
                  <Zap className="w-5 h-5 text-white" />
                )}
                {powerup.type === "points" && (
                  <Star className="w-5 h-5 text-white" />
                )}
              </div>
            ))}

            {/* Bullets */}
            {bullets.map((bullet) => (
              <div
                key={bullet.id}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                style={{
                  left: bullet.x,
                  top: bullet.y,
                  boxShadow: "0 0 5px #00ffff",
                }}
              />
            ))}

            {/* Particles */}
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  opacity: particle.life,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                }}
              />
            ))}

            {/* Status effects overlay */}
            {slowMotion && (
              <div className="absolute inset-0 bg-blue-500/10 pointer-events-none animate-pulse" />
            )}
          </div>
        </div>
      )}

      {gameState === "gameOver" && (
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-bold text-white">GAME OVER</h2>
          <div className="space-y-2">
            <div className="text-3xl">
              <span className="text-gray-400">Final Score: </span>
              <span className="text-cyan-400 font-bold">{score}</span>
            </div>
            <div className="text-xl text-purple-400">Wave {wave} Reached</div>
            {score > bestScore && (
              <div className="text-2xl text-yellow-400 animate-pulse">
                🏆 NEW RECORD! 🏆
              </div>
            )}
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white text-xl font-bold rounded-xl transform hover:scale-105 transition-all duration-200"
            >
              RETRY
            </button>
            <button
              onClick={() => setGameState("menu")}
              className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white text-xl font-bold rounded-xl transform hover:scale-105 transition-all duration-200"
            >
              MENU
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberDodgeArena;
