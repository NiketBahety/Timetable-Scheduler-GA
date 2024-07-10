export default class GeneticAlgorithm {
  constructor(cp, mp, initialPopulation, gens) {
    this.crossoverProb = cp;
    this.mutationProb = mp;
    this.population = initialPopulation;
    this.numberOfGenerations = gens;
    this.currentGeneration = 0;
  }

  getFittestIndividual() {
    let maxFitness = 0;
    let fittest;
    for (let individual of this.population) {
      if (individual.fitness >= maxFitness) {
        maxFitness = individual.fitness;
        fittest = individual;
      }
    }
    return fittest;
  }

  // nextStep() {
  //   this.currentGeneration++;

  //   // Sort based on fitness
  //   this.population.sort((a, b) => b.fitness - a.fitness);

  //   let nextGen = [];
  //   let rem = this.population.length;

  //   // if crossover probbality is x then copy the most fit n-x individuals directly to the nextGen
  //   for (
  //     let i = 0;
  //     i <
  //     Math.max(
  //       1,
  //       Math.floor(this.population.length * (1 - this.crossoverProb))
  //     );
  //     i++
  //   ) {
  //     nextGen.push(this.population[i]);
  //     rem--;
  //   }

  //   // crossover for remaining positions
  //   for (let i = 0; i < this.population.length - 1; i++) {
  //     if (rem == 0) break;
  //     rem--;
  //     nextGen.push(this.population[i].crossover(this.population[i + 1]));
  //   }

  //   // mutate
  //   for (let el of nextGen) {
  //     if (Math.random() <= this.mutationProb) {
  //       nextGen.push(el.mutate());
  //     }
  //   }

  //   this.population = nextGen;

  //   return this.getFittestIndividual();
  // }

  nextStep() {
    let maxFitness = -100;
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > maxFitness) {
        maxFitness = this.population[i].fitness;
      }
    }

    let matingPool = [];

    function mapValue(value, minFrom, maxFrom, minTo, maxTo) {
      return (
        ((value - minFrom) * (maxTo - minTo)) / (maxFrom - minFrom) + minTo
      );
    }

    for (let i = 0; i < this.population.length; i++) {
      let fit = mapValue(this.population[i].fitness, 0, maxFitness, 0, 1);
      let n = Math.floor(fit * 100);
      for (let j = 0; j < n; j++) matingPool.push(this.population[i]);
    }

    for (let i = 0; i < this.population.length; i++) {
      let a = Math.floor(Math.random() * matingPool.length);
      let b = Math.floor(Math.random() * matingPool.length);

      let child = matingPool[a].crossover(matingPool[b]);
      if (Math.random() <= this.mutationProb) {
        this.population[i] = child.mutate();
      } else {
        this.population[i] = child;
      }
    }
  }
}
