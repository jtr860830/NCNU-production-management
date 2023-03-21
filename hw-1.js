const FROM = "RABCDEFS";
const TO = "REFBACDS";
const POPULATION_SIZE = 8;

console.log(`\x1b[34mfrom: ${FROM}\x1b[0m`);
console.log(`\x1b[34mto: ${TO}\x1b[0m`);

class Individual {
  constructor(chromosome) {
    this.chromosome = chromosome;
    this.fitness = this.calFitness();
  }

  static mutatedGenes() {
    const gene = FROM[Math.floor(Math.random() * FROM.length)];
    return gene;
  }

  static createGnome() {
    const gnomeLen = TO.length;
    return Array.from({ length: gnomeLen }, () => this.mutatedGenes());
  }

  mate(par2) {
    const childChromosome = [];
    for (let i = 0; i < this.chromosome.length; i++) {
      const gp1 = this.chromosome[i];
      const gp2 = par2.chromosome[i];
      const prob = Math.random();
      if (prob < 0.45) {
        childChromosome.push(gp1);
      } else if (prob < 0.90) {
        childChromosome.push(gp2);
      } else {
        childChromosome.push(Individual.mutatedGenes());
      }
    }
    return new Individual(childChromosome);
  }

  calFitness() {
    let fitness = 0;
    for (let i = 0; i < this.chromosome.length; i++) {
      if (this.chromosome[i] !== TO[i]) {
        fitness += 1;
      }
    }
    return fitness;
  }
}

let generation = 1;
let found = false;
const population = [];

for (let i = 0; i < POPULATION_SIZE; i++) {
  const gnome = Individual.createGnome();
  population.push(new Individual(gnome));
}

while (!found) {
  population.sort((a, b) => a.fitness - b.fitness);

  if (population[0].fitness <= 0) {
    found = true;
    break;
  }

  const newGeneration = [];

  const elitism = Math.floor(0.1 * POPULATION_SIZE);
  newGeneration.push(...population.slice(0, elitism));

  const mating = Math.floor(0.9 * POPULATION_SIZE);
  for (let i = 0; i < mating; i++) {
    const parent1 = population[Math.floor(Math.random() * 4)];
    const parent2 = population[Math.floor(Math.random() * 4)];
    const child = parent1.mate(parent2);
    newGeneration.push(child);
  }

  population.splice(0, POPULATION_SIZE);
  population.push(...newGeneration);

  console.info(`\x1b[32mGeneration: ${generation}\x1b[0m \x1b[33mString: ${population[0].chromosome.join("")}\x1b[0m \x1b[31mFitness: ${population[0].fitness}\x1b[0m`);
  generation++;
}

console.info(`\x1b[32mGeneration: ${generation}\x1b[0m \x1b[33mString: ${population[0].chromosome.join("")}\x1b[0m \x1b[31mFitness: ${population[0].fitness}\x1b[0m`);
