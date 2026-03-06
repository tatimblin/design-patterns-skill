interface Shape {
  clone(): Shape;
  describe(): string;
}

class Circle implements Shape {
  constructor(public x: number, public y: number, public radius: number, public color: string) {}

  clone(): Shape {
    return new Circle(this.x, this.y, this.radius, this.color);
  }

  describe() {
    return `Circle(${this.color}, r=${this.radius}) at (${this.x}, ${this.y})`;
  }
}

class Rectangle implements Shape {
  constructor(public x: number, public y: number, public width: number, public height: number, public color: string) {}

  clone(): Shape {
    return new Rectangle(this.x, this.y, this.width, this.height, this.color);
  }

  describe() {
    return `Rect(${this.color}, ${this.width}x${this.height}) at (${this.x}, ${this.y})`;
  }
}

const registry = new Map<string, Shape>();
registry.set("red-circle", new Circle(0, 0, 50, "red"));
registry.set("blue-rect", new Rectangle(0, 0, 100, 60, "blue"));

function stamp(templateName: string, x: number, y: number): Shape {
  const proto = registry.get(templateName)!;
  const copy = proto.clone();
  (copy as any).x = x;
  (copy as any).y = y;
  return copy;
}

// --- run ---
const shapes = [
  stamp("red-circle", 10, 20),
  stamp("red-circle", 80, 40),
  stamp("blue-rect", 200, 100),
];
shapes.forEach((s) => console.log(s.describe()));
