import apiClient from "./client";
import type { PaymentIntent } from "../types";

export const PaymentService = {
  createPaymentIntent: async (
    amount: number,
    currency: string = "usd",
  ): Promise<PaymentIntent> => {
    const response = await apiClient.post("/payments/create-intent", {
      amount,
      currency,
    });
    return response.data;
  },
};
