import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: any; // ← uso de any para evitar el conflicto de tipos

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('Falta STRIPE_SECRET_KEY en las variables de entorno');
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as any,
    });
  }

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    const amountInCents = Math.round(amount * 100);
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
    });
    return { clientSecret: paymentIntent.client_secret };
  }
}