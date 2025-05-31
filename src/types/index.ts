export * from './models/invoice'
export * from './models/wallet'
export * from './models/common'

export type BaseApiError = {
  errCode: 'INTERNAL_ERROR' | 'TMR' | 'METHOD_NOT_ALLOWED' | 'NOT_FOUND' | 'FORBIDDEN' | 'BAD_REQUEST' | 'UNAUTHORIZED'
  errText: string
}
