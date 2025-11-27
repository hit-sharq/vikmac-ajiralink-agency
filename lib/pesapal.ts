import crypto from 'crypto'

interface PesapalConfig {
  consumerKey: string
  consumerSecret: string
  baseUrl: string
  callbackUrl: string
}

class PesapalService {
  private config: PesapalConfig

  constructor() {
    this.config = {
      consumerKey: process.env.PESAPAL_CONSUMER_KEY!,
      consumerSecret: process.env.PESAPAL_CONSUMER_SECRET!,
      baseUrl: process.env.PESAPAL_BASE_URL || 'https://cybqa.pesapal.com/pesapalv3',
      callbackUrl: process.env.PESAPAL_CALLBACK_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`
    }
  }

  private generateSignature(method: string, url: string, timestamp: string, body: string = ''): string {
    const message = method.toUpperCase() + url + timestamp + body
    return crypto.createHmac('sha256', this.config.consumerSecret).update(message).digest('base64')
  }

  private getAuthHeaders(method: string, url: string, body: string = ''): HeadersInit {
    const timestamp = new Date().toISOString()
    const signature = this.generateSignature(method, url, timestamp, body)

    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.consumerKey}:${signature}`,
      'Timestamp': timestamp
    }
  }

  async initiatePayment(paymentData: {
    amount: number
    currency: string
    description: string
    reference: string
    email: string
    phone?: string
    firstName: string
    lastName: string
  }) {
    const url = `${this.config.baseUrl}/api/Transactions/SubmitOrderRequest`

    const payload = {
      id: paymentData.reference,
      currency: paymentData.currency,
      amount: paymentData.amount,
      description: paymentData.description,
      callback_url: this.config.callbackUrl,
      redirect_mode: '',
      notification_id: '',
      branch: '',
      billing_address: {
        email_address: paymentData.email,
        phone_number: paymentData.phone || '',
        country_code: '',
        first_name: paymentData.firstName,
        middle_name: '',
        last_name: paymentData.lastName,
        line_1: '',
        line_2: '',
        city: '',
        state: '',
        postal_code: '',
        zip_code: ''
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders('POST', url, JSON.stringify(payload)),
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Pesapal API error: ${response.statusText}`)
    }

    return await response.json()
  }

  async getPaymentStatus(orderTrackingId: string) {
    const url = `${this.config.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders('GET', url)
    })

    if (!response.ok) {
      throw new Error(`Pesapal API error: ${response.statusText}`)
    }

    return await response.json()
  }
}

export const pesapalService = new PesapalService()
