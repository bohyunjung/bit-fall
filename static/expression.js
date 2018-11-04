class ParticleSystem {
  constructor() {
    this.dots = [];
    for (let i = W/(N_NOZZLES+1); i < W; i+=W/(N_NOZZLES+1)) {
        this.dots.push([i, 0]);
    }
    this.particles = [];
  }
  
  addParticle(x, y) {
    this.particles.push(new Particle(x, y));
  }

  applyForce(f) {
    for (let particle of this.particles) {
      particle.applyForce(f);
    }
  }

  update() {
    for (let particle of this.particles) {
      particle.run();
    }
    this.particles = this.particles.filter(particle => !particle.isDead());
  }
}

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
