import React, { useState, useEffect, useRef } from 'react'
import Button from './ui/button'
import Card from './ui/card'
import Input from './ui/input'
import Ranking from './ranking'

const WORD_POOLS = [
  'velocidad','precision','teclado','rapido','juego','puntos','record','campeon','maestro','desafio',
  'victoria','ranking','digital','teclear','agilidad','reflejos','competir','ganar','practica','talento',
  'expertidsd','rendimiento','habilidad','destreza','campeonato','torneo','medalla','trofeo','estrella',
  'poder','fuerza','energia','dinamico','activo',
]

export default function TypingGame({ onBack }) {
  const [gameState, setGameState] = useState('ready')
  const [currentWord, setCurrentWord] = useState('')
  const [userInput, setUserInput] = useState('')
  const [wordsCompleted, setWordsCompleted] = useState(0)
  const [errors, setErrors] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [showRanking, setShowRanking] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)
  const [nameInputValue, setNameInputValue] = useState('')
  const inputRef = useRef(null)
  const startTimeRef = useRef(0)

  const getRandomWord = () => WORD_POOLS[Math.floor(Math.random() * WORD_POOLS.length)]

  const startGame = () => {
    setGameState('playing')
    setCurrentWord(getRandomWord())
    setUserInput('')
    setWordsCompleted(0)
    setErrors(0)
    setTimeLeft(30)
    setScore(0)
    startTimeRef.current = Date.now()
    inputRef.current?.focus()
  }

  const calculateScore = (wordLength, timeTaken, hasError) => {
    const baseScore = wordLength * 10
    const timeBonus = Math.max(0, 50 - timeTaken * 5)
    const errorPenalty = hasError ? -20 : 0
    return Math.max(0, Math.round(baseScore + timeBonus + errorPenalty))
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setUserInput(value)
    if (value === currentWord) {
      const timeTaken = (Date.now() - startTimeRef.current) / 1000
      const wordScore = calculateScore(currentWord.length, timeTaken, errors > 0)
      setScore((prev) => prev + wordScore)
      setWordsCompleted((prev) => prev + 1)
      setCurrentWord(getRandomWord())
      setUserInput('')
      startTimeRef.current = Date.now()
    } else if (value.length > 0 && !currentWord.startsWith(value)) {
      setErrors((prev) => prev + 1)
    }
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

  const accuracy = wordsCompleted > 0 ? Math.round((wordsCompleted / (wordsCompleted + errors)) * 100) : 100

  if (showRanking) {
    return <Ranking game="typing" onBack={handleBackFromRanking} currentScore={score} currentAccuracy={accuracy} playerName={playerName} />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] gap-6">
      <div className="flex items-center justify-between w-full max-w-3xl mb-4">
        <Button variant="outline" onClick={onBack}>{"← Volver"}</Button>
        <h1 className="text-3xl md:text-4xl font-bold text-primary">{"⌨️ Speed Typing"}</h1>
        <Button variant="outline" onClick={() => setShowRanking(true)}>{"🏆 Ranking"}</Button>
      </div>

      <Card className="w-full max-w-3xl p-8 md:p-12">
        {showNameInput && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">{"¡Excelente partida!"}</h2>
            <p className="text-lg text-muted-foreground">{"Ingresa tu nombre para guardar tu puntuación"}</p>

            <div className="bg-muted p-6 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">{score}</div>
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
                <Button size="lg" onClick={handleNameSubmit} disabled={!nameInputValue.trim()} className="flex-1 text-lg py-6">
                  {"Guardar Puntuación"}
                </Button>
                <Button size="lg" variant="outline" onClick={() => setShowNameInput(false)} className="text-lg py-6">{"Cancelar"}</Button>
              </div>
            </div>
          </div>
        )}

        {!showNameInput && gameState === 'ready' && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">{"¿Listo para el desafío?"}</h2>
            <p className="text-lg text-muted-foreground">{"Escribe cada palabra lo más rápido y preciso posible. Tienes 30 segundos."}</p>
            <div className="space-y-3 text-left bg-muted p-6 rounded-lg">
              <p className="font-semibold">{"💡 Tips:"}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{"Más rápido = más puntos"}</li>
                <li>{"Los errores reducen tu puntuación"}</li>
                <li>{"Palabras más largas dan más puntos"}</li>
              </ul>
            </div>
            <Button size="lg" onClick={startGame} className="text-xl py-6 px-12">{"Comenzar Juego"}</Button>
          </div>
        )}

        {!showNameInput && gameState === 'playing' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center text-lg font-semibold">
              <div className="flex gap-6">
                <span className="text-muted-foreground">{"Palabras: "}<span className="text-primary">{wordsCompleted}</span></span>
                <span className="text-muted-foreground">{"Errores: "}<span className="text-destructive">{errors}</span></span>
              </div>
              <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-accent'}`}>{timeLeft}s</div>
            </div>

            <div className="text-center space-y-6 py-8">
              <div className="text-5xl md:text-7xl font-bold text-primary tracking-wider animate-pulse">{currentWord}</div>

              <Input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="text-3xl text-center py-8 font-mono"
                placeholder="Escribe aquí..."
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">{"Puntuación Actual"}</div>
              <div className="text-4xl font-bold text-accent">{score}</div>
            </div>
          </div>
        )}

        {!showNameInput && gameState === 'finished' && (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">{"🎉"}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">{"¡Juego Terminado!"}</h2>

            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="bg-muted p-6 rounded-lg">
                <div className="text-3xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">{"Puntuación Final"}</div>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <div className="text-3xl font-bold text-secondary">{wordsCompleted}</div>
                <div className="text-sm text-muted-foreground">{"Palabras Correctas"}</div>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <div className="text-3xl font-bold text-accent">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">{"Precisión"}</div>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <div className="text-3xl font-bold text-muted-foreground">{errors}</div>
                <div className="text-sm text-muted-foreground">{"Errores"}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={startGame} className="text-lg py-6">{"🔄 Jugar de Nuevo"}</Button>
              <Button size="lg" variant="outline" onClick={() => { setShowNameInput(true); setNameInputValue('') }} className="text-lg py-6">{"🏆 Guardar en Ranking"}</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
