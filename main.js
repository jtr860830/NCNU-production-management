import TSP from "./tsp.js";

new TSP({
  populationSize: 100,
  mutationRate: 0.1,
  crossoverRate: 0.7,
  iterationLimit: 1000,
}).run();
