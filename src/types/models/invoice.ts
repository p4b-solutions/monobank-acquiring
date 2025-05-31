import { Discount, Product, PaymentInfo, WalletData, TipsInfo, Cancelation, MerchantPayInfo } from './common'

export type InvoicePayload = {
  amount: number // Сума оплати у мінімальних одиницях (копійки для гривні)
  ccy?: number // ISO 4217 код валюти, за замовчуванням 980 (гривня)
  merchantPaymInfo?: MerchantPayInfo // Додаткова інформація для оплати, яка буде відображена на сторінці оплати
  redirectUrl?: string // Адреса для повернення (GET) - на цю адресу буде переадресовано користувача після завершення оплати (у разі успіху або помилки)
  webHookUrl?: string // Адреса для відповіді (POST) – на цю адресу буде надіслано дані про стан платежу при зміні статусу, окрім статусу expired.
  validity?: number // Строк дії в секундах, за замовчуванням рахунок перестає бути дійсним через 24 години (3600)
  paymentType?: 'debit' | 'hold' // Тип операції. Для значення hold термін складає 9 днів. Якщо через 9 днів холд не буде фіналізовано — він скасовується
  qrId?: string // Ідентифікатор QR-каси для встановлення суми оплати на існуючих QR-кас
  code?: string // Код терміналу субмерчанта, з апі “Список субмерчантів”. Доступний обмеженому колу мерчантів, які точно знають, що їм це потрібно
  saveCardData?: {
    saveCard: boolean // Ознака зберігання картки (токенізації) після оплати
    walletId?: string // Ідентифікатор гаманця користувача
  }
  agentFeePercent?: number // Відсоток комісії, який агент встановлює для себе;
  tipsEmployeeId?: string // Ідентифікатор співробітника, який може отримати чайові після оплати; ідентифікатор можна взяти з апі “Список співробітників”
  displayType?: 'iframe' // Отримання клієнтом посилання iframe для відображення віджета (якщо параметр не передано, то звичайне посилання)
}

export type InvoiceTicket = {
  invoiceId: string // Унікальний ідентифікатор рахунку
  pageUrl: string // URL сторінки оплати, на яку потрібно переадресувати користувача для завершення платежу
}

export type Invoice = {
  invoiceId: string // Унікальний ідентифікатор рахунку
  status: 'created' | 'processing' | 'hold' | 'success' | 'failure' | 'reversed' | 'expired' // Статус операції
  failureReason?: string | null // Причина відмови, якщо статус failure
  errCode?: string // Код помилки, яка виникла під час обробки платежу
  amount: number // Сума у мінімальних одиницях валюти
  ccy: number // ISO 4217 код валюти, за замовчуванням 980 (гривня)
  finalAmount?: number // Підсумкова сума у мінімальних одиницях валюти, змінюється після оплати та повернень
  createdDate?: string | null // Дата і час фінансової операції
  modifiedDate?: string | null // Дата і час останньої модифікації операції
  reference?: string // Референс платежу, який визначається продавцем
  destination?: string // Призначення платежу, визначається продавцем
  cancelList: Cancelation[] // Список заявок на скасування платежу, якщо такі були
  paymentInfo: PaymentInfo // Інформація про платіж, якщо оплата була успішною
  walletData: WalletData // Дані про гаманці, якщо картка була токенізована
  tipsInfo: TipsInfo // Інформація про чайові, якщо вони були сплачені
}

export type CancelInvoicePayload = {
  invoiceId: string // Унікальний ідентифікатор рахунку, який потрібно скасувати
  extRef?: string // Референс операції скасування, який буде вказано продавцем
  amount?: number // Сума у мінімальних одиницях (при частковому поверненні)
  items?: Product[] // Список товарів, які повертаються
}

export type CancelInvoiceTicket = {
  status: 'processing' | 'success' | 'failure' // Статус операції скасування
  createdDate: string // Дата і час створення заяви на скасування
  modifiedDate: string // Дата і час останньої модифікації операції скасування
}

export type FinalizeInvoicePayload = {
  invoiceId: string // Унікальний ідентифікатор рахунку, який потрібно фіналізувати
  amount?: number // Сума у мінімальних одиницях (при частковій фіналізації)
  items?: Product[] // Список товарів, які потрібно фіналізувати
}

export type FinalizeInvoiceTicket = {
  status: 'success' // Статус заяви: success - заяву на фіналізацію прийнято
}
