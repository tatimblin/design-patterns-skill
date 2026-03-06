interface PaymentDetails {
  amount: number;
  method: "credit_card" | "paypal" | "crypto";
}

class PaymentProcessor {
  process(payment: PaymentDetails) {
    if (payment.method === "credit_card") {
      console.log(`Charging $${payment.amount} to credit card.`);
      // credit card–specific logic...
    } else if (payment.method === "paypal") {
      console.log(`Sending $${payment.amount} via PayPal.`);
      // paypal-specific logic...
    } else if (payment.method === "crypto") {
      console.log(`Transferring $${payment.amount} in crypto.`);
      // crypto-specific logic...
    } else {
      throw new Error(`Unsupported payment method: ${payment.method}`);
    }
  }
}

// --- run ---
const processor = new PaymentProcessor();
processor.process({ amount: 50, method: "credit_card" });
processor.process({ amount: 30, method: "paypal" });
processor.process({ amount: 120, method: "crypto" });
