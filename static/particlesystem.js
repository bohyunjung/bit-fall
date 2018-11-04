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
