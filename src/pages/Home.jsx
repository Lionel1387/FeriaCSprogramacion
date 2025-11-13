import React, { useState } from 'react'
import TypingGame from '@/components/typing-game'
import AimTrainer from '@/components/aim-trainer'
import GameSelector from '@/components/game-selector'

export default function Home() {
  const [currentGame, setCurrentGame] = useState('menu') // 'menu' | 'typing' | 'aim'

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {currentGame === 'menu' && <GameSelector onSelectGame={setCurrentGame} />}
        {currentGame === 'typing' && <TypingGame onBack={() => setCurrentGame('menu')} />}
        {currentGame === 'aim' && <AimTrainer onBack={() => setCurrentGame('menu')} />}
      </div>
    </main>
  )
}
