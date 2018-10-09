// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// A class to describe a group of Particles
// An ArrayList is used to manage the list of Particles


class ParticleSystem {
  constructor() {
    this.dots = [];
    for (let i = 1440/130/2; i < 1440; i+=1440/130) {
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
