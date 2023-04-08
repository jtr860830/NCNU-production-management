import numpy as np
from geneticalgorithm import geneticalgorithm as ga

D = 5000  # Annual demand

# Define the cost function to minimize the total inventory cost
def cost(x):
    Q = x[0]  # Order quantity
    h = x[1]  # Holding cost per unit per year
    K = x[2]  # Ordering cost per order

    # Calculate the total inventory cost
    TC = (D * K / Q) + (Q / 2 * h)
    return TC

# Define the boundaries for order quantity, holding cost, and ordering cost
varbound = np.array([[50, 500], [100, 1000], [100, 1000]])

# Define the genetic algorithm parameters
algorithm_param = {'max_num_iteration': 100,
                   'population_size': 100,
                   'mutation_probability': 0.1,
                   'elit_ratio': 0.01,
                   'crossover_probability': 0.5,
                   'parents_portion': 0.3,
                   'crossover_type': 'uniform',
                   'selection_type': 'roulette',
                   'max_iteration_without_improv': None}

# Create the genetic algorithm model
model = ga(function=cost, dimension=3, variable_type='real', variable_boundaries=varbound, algorithm_parameters=algorithm_param)

# Run the genetic algorithm to find the optimal order quantity
model.run()

# Print the optimal order quantity, holding cost, and ordering cost
print(f"Optimal ordering quantity: {model.best_variable[0]}")
print(f"Optimal holding cost: {model.best_variable[1]}")
print(f"Optimal ordering cost: {model.best_variable[2]}")
print(f"Total inventory cost: {model.best_function}")
