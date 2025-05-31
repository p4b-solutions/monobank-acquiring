import MonoAcquiring from '../src'

console.clear()

const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time))
const id = () => `${Math.round(Date.now() / 1000)}`

async function test() {
  try {
    const token = process.env.TOKEN as string
    if (!token) throw new Error('Environment variable TOKEN is not set')
    let destination = process.env.DEFAULT_DESTINATION || 'Payment for goods and services'
    let invoiceId = ''
    let walletId = ''
    let cardToken = ''

    const client = new MonoAcquiring(token)

    // //>>>  Отримати дані про мерчанта
    // const merchant = await client.getMerchant()
    // console.log('Merchant: ', merchant)
    // await wait(5000)

    //>>>  Створити рахунок для оплати
    // const ticket = await client.createInvoice({ amount: 12000, merchantPaymInfo: { reference: id(), destination }, saveCardData: { saveCard: true } })
    // invoiceId = ticket.invoiceId
    // console.log('Invoice Ticket: ', ticket)
    // await wait(5000)

    // //>>>  Вилучити рахунок для оплати
    // await client.removeInvoice(invoiceId)
    // console.log('Invoice removed')
    // await wait(5000)

    // //>>>  Скасувати оплату рахунку
    // const result = client.cancelInvoice({ invoiceId, amount: 12000 })
    // console.log('Invoice cancelation: ', result)
    // await wait(5000)

    // //>>>  Отримати рахунок для оплати
    // const invoice = await client.getInvoice(invoiceId)
    // console.log('Invoice: ', invoice)
    // await wait(5000)

    // //>>>  Фіналізувати оплату рахунку
    // const result = await client.finalizeInvoice({invoiceId, amount: 12000})
    // console.log('Invoice finalization: ', result)
    // await wait(5000)

    // //>>>  Отримати перелік карток у гаманці користувача
    // const wallet = await client.getWallet(walletId)
    // console.log('Wallet: ', wallet)
    // await wait(5000)

    // //>>>  Провести оплату з гаманця користувача
    // const result = await client.paymentFromWallet({ cardToken, amount: 12000, initiationKind: 'merchant', merchantPaymInfo: { reference: id(), destination } })
    // console.log('Payment from wallet', result)
    // await wait(5000)

    // //>>>  Вилучити картку з гаманця користувача
    // client.deleteWalletCard(cardToken)
    // console.log('Wallet: ', wallet)
  } catch (error: any) {
    console.log(`Error with code [${error.code ?? 0}]: `, error.message)
  }
}

setTimeout(test, 1000)
