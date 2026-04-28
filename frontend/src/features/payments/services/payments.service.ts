import api from '../../../core/api/axiosConfig';

export const paymentsService = {
  async createPaymentIntent(amount: number, currency: string = 'usd') {
    const response = await api.post('/payments/create-payment-intent', { amount, currency });
    return response.data; // { clientSecret }
  },
};