import { useEffect, useRef, useState } from 'react'
import Confetti from 'react-confetti'
import './App.css'
import { Card } from './components/Card/Card'

const cardImages = [
  { src: '/img/helmet-1.png', matched: false },
  { src: '/img/potion-1.png', matched: false },
  { src: '/img/ring-1.png', matched: false },
  { src: '/img/scroll-1.png', matched: false },
  { src: '/img/shield-1.png', matched: false },
  { src: '/img/sword-1.png', matched: false },
]

function App() {
  const [cards, setCards] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [height, setHeight] = useState(null)
  const [width, setWidth] = useState(null)
  const [winner, setWinner] = useState(false)
  const [matches, setMatches] = useState(0)
  const confettiRef = useRef(null)

  //shuffle
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))

    setCards(shuffledCards)
    setTurns(0)
    setWinner(false)
    setMatches(0)
  }

  // handle choice

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  // compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              setMatches(matches + 1)
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        setTimeout(() => resetTurn(), 1000)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choiceOne, choiceTwo])

  //reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns((prevTurns) => prevTurns + 1)
    setDisabled(false)
  }

  useEffect(() => {
    setHeight(confettiRef.current.clientHeight)
    setWidth(confettiRef.current.clientWidth)
  }, [])

  useEffect(() => {
    if (matches === 6) {
      setWinner(true)
    }
  }, [matches, winner])

  return (
    <div className="App" ref={confettiRef}>
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>
      <h2>Turns: {turns}</h2>

      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      {winner && (
        <Confetti
          width={width + 1200}
          height={height + 600}
          recycle={winner}
          drawShape={(ctx) => {
            ctx.beginPath()
            for (let i = 0; i < 22; i++) {
              const angle = 0.35 * i
              const x = (0.2 + 1.5 * angle) * Math.cos(angle)
              const y = (0.2 + 1.5 * angle) * Math.sin(angle)
              ctx.lineTo(x, y)
            }
            ctx.stroke()
            ctx.closePath()
          }}
        />
      )}
    </div>
  )
}

export default App
