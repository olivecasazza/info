use rand::Rng;
use serde::{Deserialize, Serialize};

/// An individual in the population (a set of neural network weights)
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Individual {
    pub genes: Vec<f32>,
    pub fitness: f32,
}

impl Individual {
    pub fn new(gene_count: usize) -> Self {
        let mut rng = rand::rng();
        let genes: Vec<f32> = (0..gene_count)
            .map(|_| rng.random_range(-1.0..1.0))
            .collect();

        Self {
            genes,
            fitness: 0.0,
        }
    }

    /// Mutate this individual's genes
    pub fn mutate(&mut self, mutation_rate: f32, mutation_strength: f32) {
        let mut rng = rand::rng();
        for gene in &mut self.genes {
            if rng.random::<f32>() < mutation_rate {
                *gene += rng.random_range(-mutation_strength..mutation_strength);
                *gene = gene.clamp(-2.0, 2.0); // Keep weights bounded
            }
        }
    }

    /// Crossover with another individual
    pub fn crossover(&self, other: &Individual) -> Individual {
        let mut rng = rand::rng();
        let mut child_genes = Vec::with_capacity(self.genes.len());

        for i in 0..self.genes.len() {
            child_genes.push(if rng.random::<bool>() {
                self.genes[i]
            } else {
                other.genes[i]
            });
        }

        Individual {
            genes: child_genes,
            fitness: 0.0,
        }
    }
}

/// Simple Genetic Algorithm for evolving robot gaits
pub struct GeneticAlgorithm {
    pub population: Vec<Individual>,
    pub generation: usize,
    pub mutation_rate: f32,
    pub mutation_strength: f32,
    pub elite_count: usize,
}

impl GeneticAlgorithm {
    pub fn new(
        population_size: usize,
        gene_count: usize,
        mutation_rate: f32,
        mutation_strength: f32,
        elite_count: usize,
    ) -> Self {
        let population: Vec<Individual> = (0..population_size)
            .map(|_| Individual::new(gene_count))
            .collect();

        Self {
            population,
            generation: 0,
            mutation_rate,
            mutation_strength,
            elite_count,
        }
    }

    /// Evolve to the next generation
    pub fn evolve(&mut self) {
        // Sort by fitness (descending)
        self.population.sort_by(|a, b| {
            b.fitness.partial_cmp(&a.fitness).unwrap_or(std::cmp::Ordering::Equal)
        });

        let mut next_generation = Vec::new();

        // Elitism: Keep the best individuals
        for i in 0..self.elite_count.min(self.population.len()) {
            next_generation.push(self.population[i].clone());
        }

        // Fill the rest with offspring
        while next_generation.len() < self.population.len() {
            // Tournament selection
            let parent1 = self.tournament_select();
            let parent2 = self.tournament_select();

            // Crossover
            let mut offspring = parent1.crossover(parent2);

            // Mutation
            offspring.mutate(self.mutation_rate, self.mutation_strength);

            next_generation.push(offspring);
        }

        self.population = next_generation;
        self.generation += 1;
    }

    /// Tournament selection: pick best of k random individuals
    fn tournament_select(&self) -> &Individual {
        let mut rng = rand::rng();
        let tournament_size = 3;

        let mut best: Option<&Individual> = None;
        for _ in 0..tournament_size {
            let candidate = &self.population[rng.random_range(0..self.population.len())];
            if best.is_none() || candidate.fitness > best.unwrap().fitness {
                best = Some(candidate);
            }
        }

        best.unwrap()
    }

    /// Get the best individual
    pub fn best(&self) -> &Individual {
        self.population
            .iter()
            .max_by(|a, b| a.fitness.partial_cmp(&b.fitness).unwrap_or(std::cmp::Ordering::Equal))
            .unwrap()
    }

    /// Get average fitness
    pub fn avg_fitness(&self) -> f32 {
        let sum: f32 = self.population.iter().map(|ind| ind.fitness).sum();
        sum / self.population.len() as f32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_individual_creation() {
        let ind = Individual::new(10);
        assert_eq!(ind.genes.len(), 10);
        assert_eq!(ind.fitness, 0.0);
    }

    #[test]
    fn test_mutation() {
        let mut ind = Individual::new(100);
        let original = ind.genes.clone();
        ind.mutate(1.0, 0.1); // 100% mutation rate

        // At least some genes should have changed
        let changed = original.iter().zip(&ind.genes).filter(|(a, b)| a != b).count();
        assert!(changed > 0);
    }

    #[test]
    fn test_ga_evolution() {
        let mut ga = GeneticAlgorithm::new(20, 10, 0.1, 0.1, 2);

        // Assign some fitness
        for (i, ind) in ga.population.iter_mut().enumerate() {
            ind.fitness = i as f32;
        }

        ga.evolve();
        assert_eq!(ga.generation, 1);
        assert_eq!(ga.population.len(), 20);
    }
}
