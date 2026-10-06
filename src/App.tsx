import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
} from 'react-router-dom'
import './App.css'
import { initialTransactions } from './data/mockTransactions'
import type {
  TokenTransaction,
  TransactionCategory,
} from './types/token'

const TRANSACTIONS_KEY = 'tokenwhor.transactions'
const BONUS_KEY = 'tokenwhor.lastBonus'
const PURCHASED_KEY = 'tokenwhor.purchased'

type ShopItem = {
  id: string
  name: string
  description: string
  price: number
  emoji: string
}

const shopItems: ShopItem[] = [
  {
    id: 'neon-skin',
    name: 'Скин Neon',
    description: 'Яркий неоновый стиль профиля',
    price: 330,
    emoji: '🌈',
  },
  {
    id: 'gold-frame',
    name: 'Золотая рамка',
    description: 'Украшение для аватара',
    price: 500,
    emoji: '🏆',
  },
  {
    id: 'lucky-charm',
    name: 'Талисман удачи',
    description: 'Особый предмет коллекции',
    price: 750,
    emoji: '🍀',
  },
]

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function loadTransactions(): TokenTransaction[] {
  try {
    const saved = localStorage.getItem(TRANSACTIONS_KEY)

    if (saved) {
      return JSON.parse(saved) as TokenTransaction[]
    }
  } catch {
    return initialTransactions
  }

  return initialTransactions
}

function loadPurchased(): string[] {
  try {
    const saved = localStorage.getItem(PURCHASED_KEY)

    if (saved) {
      return JSON.parse(saved) as string[]
    }
  } catch {
    return []
  }

  return []
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Navigation({ balance }: { balance: number }) {
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-mark">₮</span>
        <span>Токенвхор</span>
      </Link>

      <nav className="nav">
        <NavLink to="/" end>
          Лобби
        </NavLink>
        <NavLink to="/game">Играть</NavLink>
        <NavLink to="/shop">Магазин</NavLink>
        <NavLink to="/profile">Профиль</NavLink>
        <NavLink to="/history">История</NavLink>
        <NavLink to="/leaderboard">Лидерборд</NavLink>
      </nav>

      <div className="balance">
        <span>Баланс</span>
        <strong>₮ {balance}</strong>
      </div>
    </header>
  )
}

function DashboardPage({
  balance,
  level,
  progress,
  transactions,
  canClaimBonus,
  onClaimBonus,
}: {
  balance: number
  level: number
  progress: number
  transactions: TokenTransaction[]
  canClaimBonus: boolean
  onClaimBonus: () => string
}) {
  const [message, setMessage] = useState('')

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">АРКАДНЫЙ ЦЕНТР</p>
          <h1>Играй. Выигрывай. Собирай.</h1>
          <p className="hero-text">
            Получай токены в мини-играх, открывай предметы и поднимайся
            в рейтинге игроков.
          </p>

          <div className="actions">
            <Link to="/game" className="button primary">
              🎰 Начать игру
            </Link>
            <button
              className="button secondary"
              disabled={!canClaimBonus}
              onClick={() => setMessage(onClaimBonus())}
            >
              🎁 Получить бонус
            </button>
          </div>

          {message && <p className="message">{message}</p>}
        </div>

        <div className="hero-token">₮</div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Текущий баланс</span>
          <strong>₮ {balance}</strong>
          <small>виртуальных токенов</small>
        </article>

        <article className="stat-card">
          <span>Текущий уровень</span>
          <strong>Уровень {level}</strong>
          <div className="progress">
            <span style={{ width: `${progress}%` }} />
          </div>
          <small>{Math.round(progress)}% до следующего уровня</small>
        </article>

        <article className="stat-card">
          <span>Последняя активность</span>
          <strong>{transactions.length}</strong>
          <small>операций в истории</small>
        </article>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">БЫСТРЫЙ ДОСТУП</p>
          <h2>Что сделать сейчас?</h2>
        </div>
      </section>

      <section className="cards-grid">
        <Link to="/game" className="feature-card">
          <span className="feature-icon">🎰</span>
          <h3>Крутить рулетку</h3>
          <p>Попробуй удачу и выиграй до 300 токенов.</p>
        </Link>

        <Link to="/shop" className="feature-card">
          <span className="feature-icon">🛍️</span>
          <h3>Открыть магазин</h3>
          <p>Потрать токены на уникальные предметы.</p>
        </Link>

        <Link to="/profile" className="feature-card">
          <span className="feature-icon">🏆</span>
          <h3>Проверить прогресс</h3>
          <p>Посмотри уровень и достижения профиля.</p>
        </Link>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">АКТИВНОСТЬ</p>
            <h2>Последние операции</h2>
          </div>
          <Link to="/history" className="text-link">
            Вся история →
          </Link>
        </div>

        <TransactionList transactions={transactions.slice(0, 3)} />
      </section>
    </>
  )
}

function GamePage({
  balance,
  onPlay,
}: {
  balance: number
  onPlay: () => string
}) {
  const [result, setResult] = useState('Сделай ставку и испытай удачу!')

  return (
    <section className="page-section">
      <p className="eyebrow">МИНИ-ИГРА</p>
      <h1>Рулетка удачи</h1>
      <p className="page-description">
        Стоимость одной попытки — 50 токенов. Победа принесёт от 100 до
        300 токенов.
      </p>

      <div className="game-card">
        <div className="roulette">🎰</div>
        <h2>{result}</h2>
        <p>Ваш баланс: ₮ {balance}</p>

        <button
          className="button primary large"
          onClick={() => setResult(onPlay())}
        >
          Крутить за 50 токенов
        </button>
      </div>
    </section>
  )
}

function ShopPage({
  balance,
  purchased,
  onBuy,
}: {
  balance: number
  purchased: string[]
  onBuy: (item: ShopItem) => string
}) {
  const [message, setMessage] = useState('')

  return (
    <section className="page-section">
      <p className="eyebrow">МАГАЗИН</p>
      <h1>Предметы за токены</h1>
      <p className="page-description">
        Баланс: <strong>₮ {balance}</strong>
      </p>

      {message && <p className="message">{message}</p>}

      <div className="shop-grid">
        {shopItems.map((item) => {
          const isPurchased = purchased.includes(item.id)

          return (
            <article className="shop-card" key={item.id}>
              <div className="shop-emoji">{item.emoji}</div>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <strong>₮ {item.price}</strong>

              <button
                className="button secondary"
                disabled={isPurchased}
                onClick={() => setMessage(onBuy(item))}
              >
                {isPurchased ? 'Куплено' : 'Купить'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function ProfilePage({
  balance,
  level,
  transactions,
}: {
  balance: number
  level: number
  transactions: TokenTransaction[]
}) {
  const games = transactions.filter(
    (transaction) => transaction.category === 'game',
  ).length

  const wins = transactions.filter(
    (transaction) =>
      transaction.category === 'game' && transaction.amount > 0,
  ).length

  const earned = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  return (
    <section className="page-section">
      <p className="eyebrow">ПРОФИЛЬ ИГРОКА</p>
      <h1>Профиль</h1>

      <div className="profile-header panel">
        <div className="avatar">👾</div>
        <div>
          <h2>Игрок TokenWhor</h2>
          <p className="muted">Уровень {level}</p>
        </div>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Баланс</span>
          <strong>₮ {balance}</strong>
        </article>

        <article className="stat-card">
          <span>Сыграно игр</span>
          <strong>{games}</strong>
        </article>

        <article className="stat-card">
          <span>Побед</span>
          <strong>{wins}</strong>
        </article>

        <article className="stat-card">
          <span>Всего заработано</span>
          <strong>₮ {earned}</strong>
        </article>
      </div>

      <div className="panel">
        <h2>Достижения</h2>
        <div className="achievement-list">
          <div className="achievement">
            <span>🎯</span>
            <div>
              <strong>Первый шаг</strong>
              <p>Совершить первую операцию</p>
            </div>
          </div>

          <div className="achievement">
            <span>{games >= 5 ? '🏆' : '🔒'}</span>
            <div>
              <strong>Азартный игрок</strong>
              <p>Сыграть пять игр</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HistoryPage({
  transactions,
}: {
  transactions: TokenTransaction[]
}) {
  return (
    <section className="page-section">
      <p className="eyebrow">ИСТОРИЯ</p>
      <h1>История операций</h1>
      <p className="page-description">
        Все начисления и списания токенов.
      </p>

      <div className="panel">
        <TransactionList transactions={transactions} />
      </div>
    </section>
  )
}

function LeaderboardPage({ balance }: { balance: number }) {
  const players = [
    { name: 'LuckyFox', score: 4820 },
    { name: 'PixelKing', score: 3650 },
    { name: 'NeonCat', score: 2990 },
    { name: 'Вы', score: balance },
  ].sort((a, b) => b.score - a.score)

  return (
    <section className="page-section">
      <p className="eyebrow">СОПЕРНИЧЕСТВО</p>
      <h1>Лидерборд</h1>
      <p className="page-description">
        Рейтинг игроков по количеству токенов.
      </p>

      <div className="panel leaderboard">
        {players.map((player, index) => (
          <div className="leader-row" key={player.name}>
            <span className="leader-place">#{index + 1}</span>
            <span className="leader-name">{player.name}</span>
            <strong>₮ {player.score}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

function TransactionList({
  transactions,
}: {
  transactions: TokenTransaction[]
}) {
  if (transactions.length === 0) {
    return <p className="muted">Операций пока нет.</p>
  }

  return (
    <div className="transactions">
      {transactions.map((transaction) => (
        <div className="transaction" key={transaction.id}>
          <div>
            <strong>{transaction.description}</strong>
            <span>
              {formatDate(transaction.createdAt)} · {transaction.category}
            </span>
          </div>

          <strong
            className={transaction.amount >= 0 ? 'positive' : 'negative'}
          >
            {transaction.amount >= 0 ? '+' : ''}
            {transaction.amount} ₮
          </strong>
        </div>
      ))}
    </div>
  )
}

function NotFoundPage() {
  return (
    <section className="page-section">
      <h1>Страница не найдена</h1>
      <Link to="/" className="button primary">
        Вернуться в лобби
      </Link>
    </section>
  )
}

export default function App() {
  const [transactions, setTransactions] = useState<TokenTransaction[]>(
    loadTransactions,
  )

  const [lastBonus, setLastBonus] = useState<string | null>(() =>
    localStorage.getItem(BONUS_KEY),
  )

  const [purchased, setPurchased] = useState<string[]>(loadPurchased)

  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    if (lastBonus) {
      localStorage.setItem(BONUS_KEY, lastBonus)
    }
  }, [lastBonus])

  useEffect(() => {
    localStorage.setItem(PURCHASED_KEY, JSON.stringify(purchased))
  }, [purchased])

  const balance = transactions[0]?.balanceAfter ?? 0
  const level = Math.floor(balance / 500) + 1
  const progress = (balance % 500) / 5
  const canClaimBonus = lastBonus !== getTodayKey()

  function addTransaction(
    amount: number,
    description: string,
    category: TransactionCategory,
    isBonus = false,
  ) {
    setTransactions((current) => {
      const currentBalance = current[0]?.balanceAfter ?? 0
      const nextBalance = currentBalance + amount

      const newTransaction: TokenTransaction = {
        id: crypto.randomUUID(),
        description,
        amount,
        category,
        status: 'completed',
        createdAt: new Date().toISOString(),
        isBonus,
        balanceAfter: nextBalance,
      }

      return [newTransaction, ...current]
    })
  }

  function claimBonus() {
    if (!canClaimBonus) {
      return 'Бонус уже получен сегодня.'
    }

    addTransaction(100, 'Ежедневный бонус', 'bonus', true)
    setLastBonus(getTodayKey())

    return 'Вы получили 100 токенов!'
  }

  function playGame() {
    if (balance < 50) {
      return 'Недостаточно токенов для игры.'
    }

    const isWin = Math.random() > 0.45

    if (isWin) {
      const prize = Math.floor(Math.random() * 3 + 1) * 100
      addTransaction(prize, `Выигрыш в рулетке: ${prize} токенов`, 'game')
      return `Поздравляем! Вы выиграли ${prize} токенов!`
    }

    addTransaction(-50, 'Проигрыш в рулетке', 'game')
    return 'В этот раз не повезло. С баланса списано 50 токенов.'
  }

  function buyItem(item: ShopItem) {
    if (purchased.includes(item.id)) {
      return 'Этот предмет уже куплен.'
    }

    if (balance < item.price) {
      return 'Недостаточно токенов для покупки.'
    }

    addTransaction(-item.price, `Покупка: ${item.name}`, 'purchase')
    setPurchased((current) => [...current, item.id])

    return `Предмет «${item.name}» куплен!`
  }

  const basename =
    import.meta.env.BASE_URL === '/'
      ? undefined
      : import.meta.env.BASE_URL.replace(/\/$/, '')

  return (
    <BrowserRouter basename={basename}>
      <div className="app">
        <Navigation balance={balance} />

        <main className="container">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  balance={balance}
                  level={level}
                  progress={progress}
                  transactions={transactions}
                  canClaimBonus={canClaimBonus}
                  onClaimBonus={claimBonus}
                />
              }
            />

            <Route
              path="/game"
              element={
                <GamePage balance={balance} onPlay={playGame} />
              }
            />

            <Route
              path="/shop"
              element={
                <ShopPage
                  balance={balance}
                  purchased={purchased}
                  onBuy={buyItem}
                />
              }
            />

            <Route
              path="/profile"
              element={
                <ProfilePage
                  balance={balance}
                  level={level}
                  transactions={transactions}
                />
              }
            />

            <Route
              path="/history"
              element={<HistoryPage transactions={transactions} />}
            />

            <Route
              path="/leaderboard"
              element={<LeaderboardPage balance={balance} />}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}