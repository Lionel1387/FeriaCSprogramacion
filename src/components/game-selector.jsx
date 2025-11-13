import React from 'react'
import Button from './ui/button'
import Card from './ui/card'

export default function GameSelector({ onSelectGame }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] gap-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold text-primary tracking-tight">{"Reflex Games"}</h1>
        <p className="text-xl md:text-2xl text-muted-foreground">{"Pon a prueba tu velocidad y precisión"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Card
          className="p-8 hover:shadow-2xl transition-all cursor-pointer border-2 hover:border-primary group"
          onClick={() => onSelectGame('typing')}
        >
          <div className="space-y-4">
            <div className="text-6xl mb-4">{"⌨️"}</div>
            <h2 className="text-3xl font-bold text-primary group-hover:scale-105 transition-transform">{"Speed Typing"}</h2>
            <p className="text-muted-foreground text-lg">{"Escribe las palabras lo más rápido posible. Tu velocidad y precisión determinan tu puntuación."}</p>
            <Button className="w-full mt-4 text-lg py-6" size="lg">{"Jugar Ahora"}</Button>
          </div>
        </Card>

        <Card
          className="p-8 hover:shadow-2xl transition-all cursor-pointer border-2 hover:border-secondary group"
          onClick={() => onSelectGame('aim')}
        >
          <div className="space-y-4">
            <div className="text-6xl mb-4">{"🎯"}</div>
            <h2 className="text-3xl font-bold text-secondary group-hover:scale-105 transition-transform">{"Aim Trainer"}</h2>
            <p className="text-muted-foreground text-lg">{"Toca los objetivos lo más rápido posible. Tu velocidad de reacción es clave."}</p>
            <Button className="w-full mt-4 text-lg py-6 bg-secondary hover:bg-secondary/90" size="lg">{"Jugar Ahora"}</Button>
          </div>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>{"🏆 Compite por el ranking global y demuestra tus habilidades"}</p>
      </div>
    </div>
  )
}
