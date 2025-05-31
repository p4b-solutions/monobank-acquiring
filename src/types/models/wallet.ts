import { MerchantPayInfo } from './common'

export type Card = {
  cardToken: string // Токен картки, який використовується для ідентифікації картки в системі
  maskedPan: string // Маскований номер картки, який відображається користувачу
  country: string // Країна банку, який випустив картку (ISO-3166-1 numeric)
}
export type Wallet = {
  wallet: Card[]
}

export type WalletPaymentPayload = {
  cardToken: string // Токен картки, який використовується для ідентифікації картки в системі
  initiationKind: 'merchant' | 'client' // Тип проведення платежу: merchant - платіж з ініціативи мерчанта, client - платіж за вимогою клієнта
  amount: number // Сума оплати у мінімальних одиницях (копійки для гривні)
  ccy?: number // ISO 4217 код валюти, за замовчуванням 980 (гривня)
  redirectUrl?: string // Адреса для повернення (GET) - на цю адресу буде переадресовано користувача після завершення оплати (у разі успіху або помилки)
  webHookUrl?: string // Адреса для відповіді (POST) – на цю адресу буде надіслано дані про стан платежу при зміні статусу, окрім статусу expired
  merchantPaymInfo?: MerchantPayInfo
  paymentType?: 'debit' | 'hold' // Тип операції. Для значення hold термін складає 9 днів. Якщо через 9 днів холд не буде фіналізовано — він скасовується
}

export type WalletPaymentTicket = {
  invoiceId: string // Унікальний ідентифікатор рахунку
  tdsUrl?: string // URL для 3D Secure авторизації, на який потрібно переадресувати користувача для завершення платежу
  status: 'created' | 'processing' | 'hold' | 'success' | 'failure' | 'reversed' | 'expired' // Статус операції
  failureReason?: string | null // Причина відмови, якщо статус failure
  amount: number // Сума у мінімальних одиницях валюти
  ccy: number // ISO 4217 код валюти, за замовчуванням 980 (гривня)
  createdDate: string | null // Дата і час фінансової операції
  modifiedDate: string | null // Дата і час останньої модифікації операції
}
