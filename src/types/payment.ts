export type PaymentMethod = "esewa" | "khalti" | "card";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
  _id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentUrl?: string;
  createdAt: string;
}

export interface InitiatePaymentPayload {
  bookingId: string;
  method: PaymentMethod;
}
