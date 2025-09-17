import crypto from 'node:crypto'

import {
  BaseApiError,
  Merchant,
  InvoicePayload,
  InvoiceTicket,
  Invoice,
  CancelInvoicePayload,
  CancelInvoiceTicket,
  FinalizeInvoicePayload,
  FinalizeInvoiceTicket,
  Wallet,
  Card,
  WalletPaymentPayload,
  WalletPaymentTicket
} from './types'

export type * from './types'
export default class MonoAcquiring {
  private token: string
  private public_key: string | null = null

  private readonly base_url: string = 'https://api.monobank.ua/api/merchant'

  constructor(token: string) {
    if (!token || typeof token !== 'string') throw new Error('MonoAcquiring requires a valid token.')
    this.token = token
    if (typeof process !== 'undefined' && process.versions?.node) {
      if (parseInt(process.versions.node) < 18) {
        throw new Error('MonoAcquiring requires Node.js version 18 or higher.')
      }
    }
  }

  private async request<T = any>(method: 'POST' | 'GET', endpoint: string, body?: Record<string, any>): Promise<T> {
    const response = await fetch(`${this.base_url}${endpoint}`, {
      method,
      headers: {
        'X-Token': this.token,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })
    if (!response.ok) {
      const { errCode, errText }: BaseApiError = await response.json()
      throw new Error(`MonoAcquiring Error [${errCode}]: ${errText}`)
    }
    if (response.headers.get('Content-Type')?.startsWith('application/json')) {
      return await response.json()
    } else {
      return (await response.text()) as T
    }
  }

  async getMerchant(): Promise<Merchant> {
    return await this.request<Merchant>('GET', '/details')
  }

  async createInvoice(payload: InvoicePayload): Promise<InvoiceTicket> {
    return await this.request<InvoiceTicket>('POST', '/invoice/create', Object.assign({ ccy: 980 }, payload))
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    return await this.request<Invoice>('GET', `/invoice/status?invoiceId=${invoiceId}`)
  }

  async cancelInvoice(payload: CancelInvoicePayload): Promise<CancelInvoiceTicket> {
    return await this.request<CancelInvoiceTicket>('POST', `/invoice/cancel`, payload)
  }

  async removeInvoice(invoiceId: string): Promise<void> {
    await this.request<CancelInvoiceTicket>('POST', `/invoice/remove`, { invoiceId })
  }

  async finalizeInvoice(payload: FinalizeInvoicePayload): Promise<FinalizeInvoiceTicket> {
    return await this.request<FinalizeInvoiceTicket>('POST', `/invoice/finalize`, payload)
  }

  async getWallet(walletId: string): Promise<Card[]> {
    const { wallet } = await this.request<Wallet>('GET', `/wallet?walletId=${walletId}`)
    return wallet
  }

  async deleteWalletCard(cardToken: string): Promise<void> {
    await this.request('GET', `/wallet/card?cardToken=${cardToken}`)
  }

  async paymentFromWallet(payload: WalletPaymentPayload) {
    return await this.request<WalletPaymentTicket>('POST', '/wallet/payment', Object.assign({ ccy: 980 }, payload))
  }

  private async getPublicKey(): Promise<void> {
    const result = await this.request<{ key: string }>('GET', '/pubkey')
    this.public_key = result.key
  }

  async validateWebhookMessage(message: string, signature: string) {
    if (!this.public_key) await this.getPublicKey()
    if (!this.public_key) throw new Error('Public key for merchant is not available.')
    let verify = crypto.createVerify('SHA256')
    verify.write(message)
    verify.end()
    return verify.verify(Buffer.from(this.public_key, 'base64'), Buffer.from(signature, 'base64'))
  }
}
