export type PaymentMethod = "esewa" | "khalti" | "card";
export type PaymentStatus = "pending" | "success" | "completed" | "failed" | "refunded";

export interface Payment {
  _id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  transactionRef?: string;
  paymentUrl?: string;
  createdAt: string;
}

export interface InitiatePaymentPayload {
  bookingId: string;
  paymentMethod: PaymentMethod;
}

export interface InitiatePaymentResult {
  payment: Payment;
  paymentUrl?: string;
}
