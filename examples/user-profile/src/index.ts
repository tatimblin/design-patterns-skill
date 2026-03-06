class UserProfile {
  constructor(
    public name: string,
    public email: string,
    public age: number | null,
    public phone: string | null,
    public address: string | null,
    public bio: string | null,
    public avatarUrl: string | null,
    public isVerified: boolean
  ) {}

  display() {
    console.log(`Name: ${this.name}`);
    console.log(`Email: ${this.email}`);
    if (this.age) console.log(`Age: ${this.age}`);
    if (this.phone) console.log(`Phone: ${this.phone}`);
    if (this.address) console.log(`Address: ${this.address}`);
    if (this.bio) console.log(`Bio: ${this.bio}`);
    if (this.avatarUrl) console.log(`Avatar: ${this.avatarUrl}`);
    console.log(`Verified: ${this.isVerified}`);
  }
}

// --- run ---
const fullProfile = new UserProfile(
  "Alice", "alice@example.com", 30, "+1-555-0100",
  "123 Main St", "Software engineer", "https://example.com/alice.png", true
);

const minimalProfile = new UserProfile(
  "Bob", "bob@example.com", null, null, null, null, null, false
);

console.log("=== Full Profile ===");
fullProfile.display();
console.log("\n=== Minimal Profile ===");
minimalProfile.display();
