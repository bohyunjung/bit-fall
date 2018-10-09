// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Simple Particle System

class Particle {
  // Another constructor (the one we are using here)
  constructor(x, y) {
    // Boring example with constant acceleration
    this.acc = createVector(0, 0);
    // this.vel = createVector(0, 0);
    // this.vel = p5.Vector.random2D();
    this.vel = createVector(random(-0.1,0.1),random(-0.1,0.1));
    this.pos = createVector(x, y);
    this.lifespan = 255;
  }

  run() {
    this.update();
    this.display();
  }

  applyForce(f) {
    this.acc.add(f);
  }

  // Method to update position
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= 6.0;
  }

  // Method to display
  display() {
    fill(220, this.lifespan);
    rect(this.pos.x, this.pos.y, 3, 1.5*this.vel.y);
  }

  // Is the particle still useful?
  isDead() {
    if (this.lifespan <= 0.0) {
      return true;
    } else {
      return false;
    }
  }
}
