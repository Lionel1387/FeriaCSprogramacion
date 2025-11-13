import React, { useState, useEffect, useRef } from 'react'
import Button from './ui/button'
import Card from './ui/card'
import Input from './ui/input'
import Ranking from './ranking'

export default function AimTrainer({ onBack }) {
  const [gameState, setGameState] = useState('ready')
  const [targets, setTargets] = useState([])
  const [score, setScore] = useState(0)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [showRanking, setShowRanking] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)
  const [nameInputValue, setNameInputValue] = useState('')
  const gameAreaRef = useRef(null)
  const nextIdRef = useRef(0)

  const createTarget = () => {
    if (!gameAreaRef.current) return
    const area = gameAreaRef.current.getBoundingClientRect()
    const size = Math.random() * 30 + 40 // 40-70px
    const target = {
      id: nextIdRef.current++,
      x: Math.random() * (area.width - size),
      y: Math.random() * (area.height - size),
      size,
      createdAt: Date.now(),
    }
    setTargets((prev) => [...prev, target])
  }

  const startGame = () => {
    setGameState('playing')
    setTargets([])
    setScore(0)
    setHits(0)
    setMisses(0)
    setTimeLeft(30)
    nextIdRef.current = 0
  }

  const handleTargetClick = (targetId) => {
    const target = targets.find((t) => t.id === targetId)
    if (!target) return
    const reactionTime = Date.now() - target.createdAt
    const sizeMultiplier = 100 / target.size
    const speedBonus = Math.max(0, 1000 - reactionTime) / 10
    const pointsEarned = Math.round(50 * sizeMultiplier + speedBonus)
    setScore((prev) => prev + pointsEarned)
    setHits((prev) => prev + 1)
    setTargets((prev) => prev.filter((t) => t.id !== targetId))
  }

  const handleMissClick = () => {
    setMisses((prev) => prev + 1)
    setScore((prev) => Math.max(0, prev - 10))
  }

  const handleNameSubmit = () => {
    if (nameInputValue.trim()) {
      setPlayerName(nameInputValue.trim())
      setShowNameInput(false)
      setShowRanking(true)
    }
  }

  const handleBackFromRanking = () => {
    setShowRanking(false)
    setPlayerName('')
  }

  useEffect(() => {
    if (gameState === 'playing') {
      const spawnInterval = setInterval(() => {
        setTargets((prev) => {
          if (prev.length < 3) createTarget()
          return prev
        })
      }, 800)
      return () => clearInterval(spawnInterval)
    }
  }, [gameState])

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('finished')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameState, timeLeft])

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0

  if (showRanking) {
    return (
      <Ranking
        game="aim"
        onBack={handleBackFromRanking}
        currentScore={score}
        currentAccuracy={accuracy}
        playerName={playerName}
      />
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] gap-6">
      <div className="flex items-center justify-between w-full max-w-5xl mb-4">
        <Button variant="outline" onClick={onBack}>{"← Volver"}</Button>
        <h1 className="text-3xl md:text-4xl font-bold text-secondary">{"🎯 Aim Trainer"}</h1>
        <Button variant="outline" onClick={() => setShowRanking(true)}>{"🏆 Ranking"}</Button>
      </div>

      <Card className="w-full max-w-5xl p-8">
        {/* showNameInput and different game states (ready, playing, finished) */}
        {showNameInput && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">{"¡Excelente partida!"}</h2>
            <p className="text-lg text-muted-foreground">{"Ingresa tu nombre para guardar tu puntuación"}</p>

            <div className="bg-muted p-6 rounded-lg">
              <div className="text-3xl font-bold text-secondary mb-2">{score}</div>
              <div className="text-sm text-muted-foreground">{"puntos"}</div>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                value={nameInputValue}
                onChange={(e) => setNameInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                placeholder="Tu nombre"
                className="text-xl text-center py-6"
                maxLength={20}
                autoFocus
              />
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={handleNameSubmit}
                  disabled={!nameInputValue.trim()}
                  className="flex-1 text-lg py-6 bg-secondary hover:bg-secondary/90"
                >
                  {"Guardar Puntuación"}
                </Button>
                <Button size="lg" variant="outline" onClick={() => setShowNameInput(false)} className="text-lg py-6">{"Cancelar"}</Button>
              </div>
            </div>
          </div>
        )}

        {!showNameInput && gameState === 'ready' && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">{"¿Listo para probar tu puntería?"}</h2>
            <p className="text-lg text-muted-foreground">{"Toca los objetivos lo más rápido posible. Tienes 30 segundos."}</p>
            <div className="space-y-3 text-left bg-muted p-6 rounded-lg">
              <p className="font-semibold">{"💡 Tips:"}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{"Objetivos más pequeños dan más puntos"}</li>
                <li>{"Reaccionar más rápido = bonificación"}</li>
                <li>{"¡No toques el fondo! Perderás puntos"}</li>
              </ul>
            </div>
            <Button size="lg" onClick={startGame} className="text-xl py-6 px-12 bg-secondary hover:bg-secondary/90">{"Comenzar Juego"}</Button>
          </div>
        )}

        {!showNameInput && gameState === 'playing' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <div className="flex gap-6">
                <span className="text-muted-foreground">{"Aciertos: "}<span className="text-secondary">{hits}</span></span>
                <span className="text-muted-foreground">{"Fallos: "}<span className="text-destructive">{misses}</span></span>
                <span className="text-muted-foreground">{"Precisión: "}<span className="text-accent">{accuracy}%</span></span>
              </div>
              <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-accent'}`}>{timeLeft}s</div>
            </div>

            <div
              ref={gameAreaRef}
              className="relative bg-muted rounded-lg overflow-hidden cursor-crosshair"
              style={{ height: '500px' }}
              onClick={handleMissClick}
            >
              {targets.map((target) => (
                <button
                  key={target.id}
                  className="absolute rounded-full bg-secondary hover:bg-secondary/80 transition-all animate-in fade-in zoom-in duration-200 cursor-pointer border-4 border-secondary-foreground/20 hover:scale-110"
                  style={{
                    left: `${target.x}px`,
                    top: `${target.y}px`,
                    width: `${target.size}px`,
                    height: `${target.size}px`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTargetClick(target.id)
                  }}
                  aria-label="Target"
                />
              ))}

              {targets.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xl">{"Prepárate..."}</div>
              )}
            </div>

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">{"Puntuación Actual"}</div>
              <div className="text-4xl font-bold text-accent">{score}</div>
            </div>
          </div>
        )}

        {!showNameInput && gameState === 'finished' && (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">{"🎯"}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">{"¡Juego Terminado!"}</h2>

            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="bg-muted p-6 rounded-lg">
                <div className="text-3xl font-bold text-secondary">{score}</div>
                <div className="text-sm text-muted-foreground">{"Puntuación Final"}</div>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <div className="text-3xl font-bold text-primary">{hits}</div>
                <div className="text-sm text-muted-foreground">{"Aciertos"}</div>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <div className="text-3xl font-bold text-accent">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">{"Precisión"}</div>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <div className="text-3xl font-bold text-muted-foreground">{misses}</div>
                <div className="text-sm text-muted-foreground">{"Fallos"}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={startGame} className="text-lg py-6 bg-secondary hover:bg-secondary/90">{"🔄 Jugar de Nuevo"}</Button>
              <Button size="lg" variant="outline" onClick={() => { setShowNameInput(true); setNameInputValue('') }} className="text-lg py-6">{"🏆 Guardar en Ranking"}</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
