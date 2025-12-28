import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Choice = 'rock' | 'paper' | 'scissors'
type Result = 'win' | 'lose' | 'draw'

interface GameRound {
  player: Choice
  computer: Choice
  result: Result
}

export default function RockPaperScissors() {
  const { t } = useTranslation()
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null)
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [score, setScore] = useState({ player: 0, computer: 0, draws: 0 })
  const [history, setHistory] = useState<GameRound[]>([])
  const [animating, setAnimating] = useState(false)

  const choices: { id: Choice; emoji: string; beats: Choice }[] = [
    { id: 'rock', emoji: '🪨', beats: 'scissors' },
    { id: 'paper', emoji: '📄', beats: 'rock' },
    { id: 'scissors', emoji: '✂️', beats: 'paper' },
  ]

  const play = (choice: Choice) => {
    setAnimating(true)
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult(null)

    // Animate countdown
    setTimeout(() => {
      const computer = choices[Math.floor(Math.random() * 3)].id
      setPlayerChoice(choice)
      setComputerChoice(computer)

      let gameResult: Result
      if (choice === computer) {
        gameResult = 'draw'
        setScore(prev => ({ ...prev, draws: prev.draws + 1 }))
      } else if (
        (choice === 'rock' && computer === 'scissors') ||
        (choice === 'paper' && computer === 'rock') ||
        (choice === 'scissors' && computer === 'paper')
      ) {
        gameResult = 'win'
        setScore(prev => ({ ...prev, player: prev.player + 1 }))
      } else {
        gameResult = 'lose'
        setScore(prev => ({ ...prev, computer: prev.computer + 1 }))
      }

      setResult(gameResult)
      setHistory(prev => [{ player: choice, computer, result: gameResult }, ...prev].slice(0, 10))
      setAnimating(false)
    }, 500)
  }

  const resetGame = () => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult(null)
    setScore({ player: 0, computer: 0, draws: 0 })
    setHistory([])
  }

  const getChoiceEmoji = (choice: Choice) => choices.find(c => c.id === choice)?.emoji || ''

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score.player}</div>
            <div className="text-sm text-slate-500">{t('tools.rockPaperScissors.you')}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded">
            <div className="text-2xl font-bold text-slate-600">{score.draws}</div>
            <div className="text-sm text-slate-500">{t('tools.rockPaperScissors.draws')}</div>
          </div>
          <div className="p-3 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">{score.computer}</div>
            <div className="text-sm text-slate-500">{t('tools.rockPaperScissors.computer')}</div>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="w-full py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
        >
          {t('tools.rockPaperScissors.resetScore')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-4 text-center">
          {t('tools.rockPaperScissors.makeYourChoice')}
        </h3>
        <div className="flex justify-center gap-4">
          {choices.map(choice => (
            <button
              key={choice.id}
              onClick={() => play(choice.id)}
              disabled={animating}
              className={`w-24 h-24 text-5xl bg-slate-100 rounded-xl hover:bg-slate-200 hover:scale-110 transition-all disabled:hover:scale-100 disabled:opacity-50 ${animating ? 'animate-pulse' : ''}`}
            >
              {choice.emoji}
            </button>
          ))}
        </div>
      </div>

      {(playerChoice || animating) && (
        <div className="card p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-slate-500 mb-2">{t('tools.rockPaperScissors.you')}</div>
              <div className={`text-6xl ${animating ? 'animate-bounce' : ''}`}>
                {playerChoice ? getChoiceEmoji(playerChoice) : '❓'}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-400">VS</span>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-2">{t('tools.rockPaperScissors.computer')}</div>
              <div className={`text-6xl ${animating ? 'animate-bounce' : ''}`}>
                {computerChoice ? getChoiceEmoji(computerChoice) : '❓'}
              </div>
            </div>
          </div>

          {result && (
            <div className={`mt-4 p-4 rounded-lg text-center ${
              result === 'win' ? 'bg-green-100 text-green-700' :
              result === 'lose' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              <div className="text-3xl mb-1">
                {result === 'win' ? '🎉' : result === 'lose' ? '😢' : '🤝'}
              </div>
              <div className="text-xl font-bold">
                {result === 'win' && t('tools.rockPaperScissors.youWin')}
                {result === 'lose' && t('tools.rockPaperScissors.youLose')}
                {result === 'draw' && t('tools.rockPaperScissors.itsDraw')}
              </div>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.rockPaperScissors.history')}</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.map((round, i) => (
              <div
                key={i}
                className={`flex justify-between items-center p-2 rounded text-sm ${
                  round.result === 'win' ? 'bg-green-50' :
                  round.result === 'lose' ? 'bg-red-50' :
                  'bg-yellow-50'
                }`}
              >
                <span>{getChoiceEmoji(round.player)} vs {getChoiceEmoji(round.computer)}</span>
                <span className={`font-medium ${
                  round.result === 'win' ? 'text-green-600' :
                  round.result === 'lose' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {round.result === 'win' && t('tools.rockPaperScissors.win')}
                  {round.result === 'lose' && t('tools.rockPaperScissors.loss')}
                  {round.result === 'draw' && t('tools.rockPaperScissors.draw')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.rockPaperScissors.rules')}</h4>
        <div className="grid grid-cols-3 gap-2 text-sm text-center">
          <div className="p-2 bg-white rounded">🪨 beats ✂️</div>
          <div className="p-2 bg-white rounded">✂️ beats 📄</div>
          <div className="p-2 bg-white rounded">📄 beats 🪨</div>
        </div>
      </div>
    </div>
  )
}
