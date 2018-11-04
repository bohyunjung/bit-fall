class Particle {
  constructor(x, y) {
    this.acc = createVector(0, 0);
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

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= 7.0;
    
  }

  display() {
    fill(220, this.lifespan);
    rect(this.pos.x, this.pos.y, 3, 1.5*this.vel.y);
  }

  isDead() {
    return this.lifespan <= 0.0 ? true : false;
  }
}