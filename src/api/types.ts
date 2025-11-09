// Auth Types
export interface UserCreate {
  email: string
  username: string
  password: string
}

export interface UserLogin {
  username: string  // Can be username or email
  password: string
}

export interface UserResponse {
  id: number
  email: string
  username: string
  is_active: boolean
  is_superuser: boolean
}

export interface Token {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface TokenData {
  access_token: string
  refresh_token: string
  token_type: string
}

// Strategy Types
export interface StrategyBase {
  name: string
  base_currency: string
  quote_currency: string
  amount_quote: number
  interval: string  // Format: '1h', '8h', '30m', '1d', '1w'
  slippage_bps: number
  min_order_quote: number
  max_order_quote: number
  max_daily_orders: number
  order_side: 'BUY' | 'SELL'
  enabled: boolean
  // Dip-buy configuration
  dip_enabled: boolean
  dip_threshold_bps: number
  dip_amount_mode: 'same' | 'multiplier'
  dip_amount_multiplier: number
  dip_max_per_day: number
  dip_cooldown_seconds: number
}

export interface StrategyCreate extends StrategyBase {}

export interface StrategyUpdate extends Partial<StrategyBase> {
  name?: string
  base_currency?: string
  quote_currency?: string
  amount_quote?: number
  interval?: string
  slippage_bps?: number
  min_order_quote?: number
  max_order_quote?: number
  max_daily_orders?: number
  order_side?: 'BUY' | 'SELL'
  enabled?: boolean
  dip_enabled?: boolean
  dip_threshold_bps?: number
  dip_amount_mode?: 'same' | 'multiplier'
  dip_amount_multiplier?: number
  dip_max_per_day?: number
  dip_cooldown_seconds?: number
}

export interface Strategy extends StrategyBase {
  id: number
  created_at?: string
  updated_at?: string
}

// Order Types
export interface Order {
  id: number
  strategy_id: number | null
  client_order_id: string
  side: 'buy' | 'sell'
  size_base: number
  price_quote: number
  cost_quote: number
  slippage_bps: number
  status: 'pending' | 'filled' | 'failed' | 'cancelled'
  exchange_order_id: string | null
  placed_at: string
  filled_at: string | null
  fees_quote: number | null
  liquidity: 'maker' | 'taker' | 'mixed' | 'unknown' | null
  reason: 'scheduled' | 'dip' | string | null
}

// Stats Types
export interface StrategyStats {
  strategy_id: number
  base_currency: string
  quote_currency: string
  position_base: number
  position_value_quote: number
  avg_buy_price: number
  invested_quote: number
  proceeds_quote: number
  realized_pnl_quote: number
  unrealized_pnl_quote: number
  roi: number  // ROI as decimal (e.g., -0.003769960117 = -0.38%)
  current_price: number
  price_basis: string
  fees: {
    total_quote: number
    buy_quote: number
    sell_quote: number
    assumptions: {
      maker_fee_bps: number
      taker_fee_bps: number
      unrealized_assumes_taker_on_exit: boolean
    }
  }
  order_counts: {
    filled: number
    failed: number
    resting: number
  }
}

export interface StrategiesStatsResponse {
  stats: StrategyStats[]
}

// Balance Types
export interface Balance {
  usdc_available: number
}

// API Response Types
export interface ApiError {
  detail: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

