<div align="center">
  <img src="https://files.p4b.biz/v3/download/assets/npm/pro4biz-monobank-acquiring.png" alt="@pro4biz/monobank-acquiring" width="120" height="120">

# @pro4biz/monobank-acquiring

[![npm version](https://badge.fury.io/js/@pro4biz%2Fmonobank-acquiring.svg)](https://badge.fury.io/js/@pro4biz%2Fmonobank-acquiring)

</div>

> TypeScript клієнт для роботи з API еквайрингу Monobank

## 🚀 Особливості

- ✅ **TypeScript підтримка** - повна типізація API
- 🔒 **Безпека** - валідація webhook повідомлень
- 🎯 **Простота** - інтуїтивний API для всіх операцій
- 🚀 **Node.js 18+** - використання можливостей NodeJS без жодних зовнішніх модулів

## 📦 Встановлення

```bash
npm install @pro4biz/monobank-acquiring
```

або

```bash
yarn add @pro4biz/monobank-acquiring
```

## 🎯 Використання

### Базова ініціалізація

```typescript
import MonoAcquiring from '@pro4biz/monobank-acquiring'

const mono = new MonoAcquiring('YOUR_API_TOKEN')
```

### 👤 Отримання інформації про мерчанта

```typescript
const merchant = await mono.getMerchant()
console.log(merchant)
// {
//   merchantId: "merchant_id",
//   merchantName: "Назва магазину",
//   pubKey: "публічний_ключ"
// }
```

### 💳 Створення рахунку для оплати

```typescript
const invoice = await mono.createInvoice({
  amount: 12000, // 120.00 грн (у копійках)
  merchantPaymInfo: {
    reference: 'order-12345',
    destination: 'Оплата за товар'
  },
  redirectUrl: 'https://example.com/success',
  webHookUrl: 'https://example.com/webhook'
})

console.log(invoice.pageUrl) // URL для переадресації користувача
```

### 📋 Перевірка статусу платежу

```typescript
const status = await mono.getInvoice(invoice.invoiceId)
console.log(status.status) // 'created', 'processing', 'success', 'failure', etc.
```

### 🔄 Робота з холдами

```typescript
// Створення холду
const holdInvoice = await mono.createInvoice({
  amount: 10000,
  paymentType: 'hold',
  merchantPaymInfo: {
    reference: 'hold-order-123',
    destination: 'Бронювання'
  }
})

// Фіналізація холду (повна сума)
await mono.finalizeInvoice({
  invoiceId: holdInvoice.invoiceId
})

// Часткова фіналізація
await mono.finalizeInvoice({
  invoiceId: holdInvoice.invoiceId,
  amount: 5000 // Фіналізуємо тільки 50.00 грн
})
```

### ↩️ Скасування та повернення

```typescript
// Повне скасування
await mono.cancelInvoice({
  invoiceId: 'invoice_id'
})

// Часткове повернення
await mono.cancelInvoice({
  invoiceId: 'invoice_id',
  amount: 5000, // Повертаємо 50.00 грн
  extRef: 'refund-123'
})

// Видалення рахунку (тільки для створених, але не оплачених)
await mono.removeInvoice('invoice_id')
```

### 🎫 Токенізація карт (збереження в гаманці)

```typescript
// Створення рахунку із збереженням картки
const invoice = await mono.createInvoice({
  amount: 10000,
  saveCardData: {
    saveCard: true,
    walletId: 'user-wallet-123'
  },
  merchantPaymInfo: {
    reference: 'order-with-save',
    destination: 'Оплата із збереженням картки'
  }
})

// Отримання збережених карт користувача
const cards = await mono.getWallet('user-wallet-123')
console.log(cards)

// Оплата збереженою карткою
const walletPayment = await mono.paymentFromWallet({
  cardToken: 'card_token_from_wallet',
  amount: 5000,
  merchantPaymInfo: {
    reference: 'wallet-payment-456',
    destination: 'Оплата збереженою карткою'
  }
})

// Видалення картки з гаманця
await mono.deleteWalletCard('card_token')
```

### � Валідація webhook повідомлень

```typescript
// У вашому webhook обробнику
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-sign'] as string
  const body = JSON.stringify(req.body)

  const isValid = await mono.validateWebhookMessage(body, signature)

  if (isValid) {
    // Обробляємо webhook
    const { invoiceId, status } = req.body
    console.log(`Платіж ${invoiceId} змінив статус на ${status}`)
  } else {
    console.log('Недійсний webhook')
  }

  res.status(200).send('OK')
})
```

### 💡 Розширені приклади

#### QR-каси та термінали

```typescript
const qrInvoice = await mono.createInvoice({
  amount: 15000,
  qrId: 'qr-terminal-001', // Ідентифікатор QR-каси
  code: 'terminal-123', // Код терміналу субмерчанта
  merchantPaymInfo: {
    reference: 'qr-payment-789',
    destination: 'Оплата через QR'
  }
})
```

#### Чайові для співробітників

```typescript
const invoiceWithTips = await mono.createInvoice({
  amount: 8000,
  tipsEmployeeId: 'employee-001',
  merchantPaymInfo: {
    reference: 'order-with-tips',
    destination: 'Оплата з можливістю чайових'
  }
})
```

#### Iframe інтеграція

```typescript
const iframeInvoice = await mono.createInvoice({
  amount: 6000,
  displayType: 'iframe',
  merchantPaymInfo: {
    reference: 'iframe-payment',
    destination: 'Оплата через iframe'
  }
})

// Використовуйте invoice.pageUrl в iframe
```

## 🛠 API Reference

### Конструктор

- `new MonoAcquiring(token: string)` - створення екземпляра клієнта

### Методи

- `getMerchant()` - отримання даних про мерчанта
- `createInvoice(payload)` - створення рахунку
- `getInvoice(invoiceId)` - отримання статусу рахунку
- `cancelInvoice(payload)` - скасування/повернення
- `removeInvoice(invoiceId)` - видалення рахунку
- `finalizeInvoice(payload)` - фіналізація холду
- `getWallet(walletId)` - отримання карт з гаманця
- `deleteWalletCard(cardToken)` - видалення картки
- `paymentFromWallet(payload)` - оплата збереженою карткою
- `validateWebhookMessage(message, signature)` - валідація webhook

## 📋 Вимоги

- Node.js 18.0 або вище
- TypeScript 4.0+ (опціонально)

## 📖 Документація

- [Офіційна документація Monobank API](https://api.monobank.ua/docs/acquiring.html)

## 📄 Ліцензія

ISC

## 🏢 Автор

**ПРО-рішення для бізнесу**

- 🌐 **Веб-сайт**: [p4b.com.ua](https://p4b.com.ua)
- 📧 **Email**: [sales@p4b.com.ua](mailto:sales@p4b.com.ua)
- 📦 **NPM**: [@pro4biz](https://www.npmjs.com/org/pro4biz)

---

<div align="center">
  <p>Зроблено з ❤️ в Україні 🇺🇦</p>
</div>
