import type { TokenTransaction } from '../types/token'

export const initialTransactions: TokenTransaction[] = [
  {
    id: 'tx-003',
    description: 'Покупка скина Neon',
    amount: -330,
    category: 'purchase',
    status: 'completed',
    createdAt: '2026-09-03T15:30:00',
    isBonus: false,
    balanceAfter: 920,
  },
  {
    id: 'tx-002',
    description: 'Выигрыш в рулетке',
    amount: 250,
    category: 'game',
    status: 'completed',
    createdAt: '2026-09-02T12:10:00',
    isBonus: false,
    balanceAfter: 1250,
  },
  {
    id: 'tx-001',
    description: 'Стартовый бонус',
    amount: 1000,
    category: 'bonus',
    status: 'completed',
    createdAt: '2026-09-01T10:00:00',
    isBonus: true,
    balanceAfter: 1000,
  },
]