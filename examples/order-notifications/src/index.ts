interface Order {
  id: string;
  item: string;
  total: number;
}

class EmailService {
  sendOrderConfirmation(order: Order) {
    console.log(`[Email] Confirmation for order ${order.id}: ${order.item}`);
  }
}

class SmsService {
  sendOrderText(order: Order) {
    console.log(`[SMS] Order ${order.id} placed — $${order.total}`);
  }
}

class AnalyticsService {
  trackPurchase(order: Order) {
    console.log(`[Analytics] Purchase tracked: ${order.id}, $${order.total}`);
  }
}

class OrderService {
  private emailService = new EmailService();
  private smsService = new SmsService();
  private analyticsService = new AnalyticsService();

  placeOrder(order: Order) {
    console.log(`Order ${order.id} placed.`);

this.emailService.sendOrderConfirmation(order);
    this.smsService.sendOrderText(order);
    this.analyticsService.trackPurchase(order);
  }
}

// --- run ---
const service = new OrderService();
service.placeOrder({ id: "001", item: "Keyboard", total: 75 });
