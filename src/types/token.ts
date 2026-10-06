export type TransactionCategory =
  | 'game'
  | 'bonus'
  | 'purchase'
  | 'quest'

export type TransactionStatus = 'completed' | 'cancelled'

export interface TokenTransaction {
  id: string
  description: string
  amount: number
  category: TransactionCategory
  status: TransactionStatus
  createdAt: string
  isBonus: boolean
  balanceAfter: number
}