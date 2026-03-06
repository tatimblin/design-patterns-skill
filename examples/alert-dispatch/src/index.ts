class Notification {
  constructor(public recipient: string, public message: string) {}
  send() { throw new Error("not implemented"); }
}

class EmailAlert extends Notification {
  send() {
    console.log(`[Email/Alert] To: ${this.recipient} | URGENT: ${this.message}`);
  }
}

class SmsAlert extends Notification {
  send() {
    console.log(`[SMS/Alert] To: ${this.recipient} | URGENT: ${this.message}`);
  }
}

class EmailReminder extends Notification {
  send() {
    console.log(`[Email/Reminder] To: ${this.recipient} | Remember: ${this.message}`);
  }
}

class SmsReminder extends Notification {
  send() {
    console.log(`[SMS/Reminder] To: ${this.recipient} | Remember: ${this.message}`);
  }
}

// --- run ---
const notifications: Notification[] = [
  new EmailAlert("alice@example.com", "Server CPU above 95%"),
  new SmsAlert("+1-555-0100", "Server CPU above 95%"),
  new EmailReminder("bob@example.com", "Deploy scheduled for 3 PM"),
  new SmsReminder("+1-555-0200", "Deploy scheduled for 3 PM"),
];
notifications.forEach((n) => n.send());
