import React from 'react'
import Button from './ui/button'
import Card from './ui/card'

const mockTypingRanking = [
  { rank: 1, name: 'SpeedMaster', score: 2450, accuracy: 98, date: '2024-01-15' },
  { rank: 2, name: 'FastTyper', score: 2280, accuracy: 95, date: '2024-01-14' },
  { rank: 3, name: 'KeyboardNinja', score: 2150, accuracy: 96, date: '2024-01-13' },
  { rank: 4, name: 'TypePro', score: 2050, accuracy: 92, date: '2024-01-12' },
  { rank: 5, name: 'QuickFingers', score: 1980, accuracy: 94, date: '2024-01-11' },
]

const mockAimRanking = [
  { rank: 1, name: 'Sharpshooter', score: 3250, accuracy: 97, date: '2024-01-15' },
  { rank: 2, name: 'PrecisionKing', score: 3100, accuracy: 95, date: '2024-01-14' },
  { rank: 3, name: 'AimGod', score: 2950, accuracy: 93, date: '2024-01-13' },
  { rank: 4, name: 'TargetHunter', score: 2800, accuracy: 91, date: '2024-01-12' },
  { rank: 5, name: 'QuickShot', score: 2650, accuracy: 89, date: '2024-01-11' },
]

export default function Ranking({ game, onBack, currentScore, currentAccuracy, playerName }) {
  const data = game === 'typing' ? mockTypingRanking : mockAimRanking
  const title = game === 'typing' ? 'Speed Typing' : 'Aim Trainer'
  const emoji = game === 'typing' ? '⌨️' : '🎯'

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] gap-6">
      <div className="flex items-center justify-between w-full max-w-4xl mb-4">
        <Button variant="outline" onClick={onBack}>{"← Volver al Juego"}</Button>
        <h1 className="text-3xl md:text-4xl font-bold">{`${emoji} Ranking Global`}</h1>
        <div className="w-32" />
      </div>

      <Card className="w-full max-w-4xl p-8">
        <div className="space-y-6">
          <div className="text-center pb-4 border-b">
            <h2 className="text-2xl font-bold text-muted-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{"Top 5 mejores puntuaciones"}</p>
          </div>

          {playerName && currentScore !== undefined && (
            <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-lg text-primary-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold">{"🌟"}</div>
                  <div>
                    <div className="font-bold text-lg">{playerName}</div>
                    <div className="text-sm opacity-90">{"Tu puntuación"}</div>
                  </div>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <div className="text-2xl font-bold">{currentScore}</div>
                    <div className="text-xs opacity-90">{"puntos"}</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{currentAccuracy}%</div>
                    <div className="text-xs opacity-90">{"precisión"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {data.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  entry.rank === 1
                    ? 'bg-accent text-accent-foreground'
                    : entry.rank === 2
                    ? 'bg-secondary text-secondary-foreground'
                    : entry.rank === 3
                    ? 'bg-primary/20'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold min-w-12">
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{entry.name}</div>
                    <div className="text-sm opacity-70">{entry.date}</div>
                  </div>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <div className="text-2xl font-bold">{entry.score}</div>
                    <div className="text-xs opacity-70">{"puntos"}</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{entry.accuracy}%</div>
                    <div className="text-xs opacity-70">{"precisión"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t text-center space-y-4">
            <p className="text-muted-foreground">{"💡 Para guardar tu puntuación, conecta Firebase en el código"}</p>
            <div className="bg-muted p-4 rounded-lg text-left text-sm">
              <p className="font-semibold mb-2">{"📝 Estructura Firebase sugerida:"}</p>
              <code className="block text-xs font-mono">
                {`rankings/${game}/entries`}
                <br />
                {`- userId, name, score, accuracy, timestamp`}
              </code>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
