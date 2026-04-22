import apiClient from "./client";

export const PaymentService = {
  createOrder: async (checkoutId: string, cartId: string, userId: string, paymentMethod: string, splitCount: number): Promise<any> => {
    const params = new URLSearchParams();
    params.append('checkout_id', checkoutId);
    params.append('cart_id', cartId);
    params.append('user_id', userId);
    params.append('payment_method', paymentMethod);
    params.append('split_count', splitCount.toString());

    const response = await apiClient.post(":8082/order", params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  },

  processPayment: async (
    checkoutId: string,
    amount: number,
    userId: string
  ): Promise<{ message: string; status: string; client_secret?: string; payment_id?: string }> => {
    const response = await apiClient.post(":8083/api/v1/payment/process", {
      checkout_id: checkoutId,
      amount,
      user_id: userId,
      payment_method: "full",
      currency: "usd",
      payment_gateway: "airwallex",
      return_url: window.location.origin + "/checkout"
    });
    return response.data;
  },

  confirmPayment: async (checkoutId: string, paymentIntentId: string): Promise<any> => {
    const response = await apiClient.post(`:8083/api/v1/payment/confirm?checkout_id=${checkoutId}&payment_intent_id=${paymentIntentId}`);
    return response.data;
  }
};
