class TSP {
  // the distance between each pair of cities
  #distances = [
    // city 0 to all other cities
    [0, 10, 15, 20, 25, 30, 35, 40, 45, 50],
    // city 1 to all other cities
    [10, 0, 5, 10, 15, 20, 25, 30, 35, 40],
    // city 2 to all other cities
    [15, 5, 0, 5, 10, 15, 20, 25, 30, 35],
    // city 3 to all other cities
    [20, 10, 5, 0, 5, 10, 15, 20, 25, 30],
    // city 4 to all other cities
    [25, 15, 10, 5, 0, 5, 10, 15, 20, 25],
    // city 5 to all other cities
    [30, 20, 15, 10, 5, 0, 5, 10, 15, 20],
    // city 6 to all other cities
    [35, 25, 20, 15, 10, 5, 0, 5, 10, 15],
    // city 7 to all other cities
    [40, 30, 25, 20, 15, 10, 5, 0, 5, 10],
    // city 8 to all other cities
    [45, 35, 30, 25, 20, 15, 10, 5, 0, 5],
    // city 9 to all other cities
    [50, 40, 35, 30, 25, 20, 15, 10, 5, 0],
  ];

  constructor({ populationSize, mutationRate, crossoverRate, iterationLimit }) {
    this.populationSize = populationSize;
    this.mutationRate = mutationRate;
    this.crossoverRate = crossoverRate;
    this.iterationLimit = iterationLimit;
    this.citiesNum = this.#distances.length;

    // initialize population
    this.population = [];
    for (let i = 0; i < this.populationSize; i++) {
      // create random cities
      const individual = [];
      for (let j = 0; j < this.citiesNum; j++) {
        individual.push(j);
      }
      // shuffle cities
      for (let j = 0; j < this.citiesNum; j++) {
        const randomIdx = Math.floor(Math.random() * this.citiesNum);
        [individual[j], individual[randomIdx]] = [individual[randomIdx], individual[j]];
      }
      // insert cities into population
      this.population.push(individual);
    }
  }


  run() {
    // iterate
    for (let i = 0; i < this.iterationLimit; i++) {
      this.evolve();
    }
    // sort the population by fitness
    this.population.sort((a, b) => this.calcFitness(a) - this.calcFitness(b));
    // print the best individual
    console.info(`the best route: ${this.population[0].join("-")}, fitness: ${this.calcFitness(this.population[0])}`);
  }

  // evolve the population
  evolve() {
    // select individuals for the next generation
    this.selection();
    // create the new generation by performing crossover and mutation
    for (let i = 0; i < this.populationSize; i++) {
      // with probability crossover rate, perform crossover
      if (Math.random() < this.crossoverRate) {
        const individual1 = this.population[i];
        const individual2 = this.population[Math.floor(Math.random() * this.populationSize)];
        this.population[i] = this.crossover(individual1, individual2);
      }
      // perform mutation on the individual
      this.population[i] = this.mutation(this.population[i]);
    }
  }

  selection() {
    // calculate the fitness of each individual
    const fitnesses = [];
    for (const p of this.population) {
      const fitness = this.calcFitness(p);
      fitnesses.push(fitness);
    }
    // normalize the fitness values
    const totalFitness = fitnesses.reduce((a, b) => a + b, 0);
    const probabilities = fitnesses.map((fitness) => fitness / totalFitness);
    // select individuals for the next generation
    const nextGeneration = [];
    for (let i = 0; i < this.populationSize; i++) {
      // choose two individuals based on their probabilities
      let individual1 = Math.random();
      let individual2 = Math.random();
      let prob1 = 0;
      let prob2 = 0;
      let index1 = 0;
      let index2 = 0;

      for (let j = 0; j < this.populationSize; j++) {
        prob1 += probabilities[j];
        if (individual1 < prob1) {
          index1 = j;
          break;
        }
      }
      for (let j = 0; j < this.populationSize; j++) {
        if (j === index1) continue;
        prob2 += probabilities[j];
        if (individual2 < prob2) {
          index2 = j;
          break;
        }
      }
      // add the fittest individual to the next generation
      nextGeneration.push(this.calcFitness(this.population[index1]) < this.calcFitness(this.population[index2]) ? this.population[index1] : this.population[index2]);
    }
    this.population = nextGeneration;
  }

  crossover(individual1, individual2) {
    // choose a random crossover point
    const point = Math.floor(Math.random() * this.citiesNum);
    // create the offspring by combining the two individuals
    let offspring = individual1.slice(0, point).concat(individual2.slice(point));
    // remove duplicate cities from the offspring
    const uniqueCities = new Set(offspring);
    offspring = [...uniqueCities];
    // if the offspring is too short, add cities from the other individual
    if (offspring.length < this.citiesNum) {
      for (let i = 0; i < this.citiesNum; i++) {
        if (!offspring.includes(individual1[i])) {
          offspring.push(individual1[i]);
        }
      }
    }
    // return the offspring
    return offspring;
  }

  mutation(individual) {
    // iterate over the cities in the individual
    for (let i = 0; i < this.citiesNum; i++) {
      // with probability mutation rate, swap this city with another city
      if (Math.random() < this.mutationRate) {
        let j = Math.floor(Math.random() * this.citiesNum);
        [individual[i], individual[j]] = [individual[j], individual[i]];
      }
    }
    // return the mutated individual
    return individual;
  }

  calcFitness(individual) {
    let fitness = 0;
    for (let i = 0; i < this.citiesNum - 1; i++) {
      const from = individual[i];
      const to = individual[i + 1];
      fitness += this.#distances[from][to];
    }
    return fitness;
  }
}

new TSP({
  populationSize: 100,
  mutationRate: 0.1,
  crossoverRate: 0.7,
  iterationLimit: 1000,
}).run();
