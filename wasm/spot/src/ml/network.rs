use nalgebra as na;
use serde::{Deserialize, Serialize};

/// A single layer in the neural network: Linear transformation + Activation
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Layer {
    /// Weight matrix (output_size × input_size)
    pub weights: na::DMatrix<f32>,
    /// Bias vector (output_size)
    pub biases: na::DVector<f32>,
    /// Activation function type
    pub activation: Activation,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum Activation {
    Tanh,
    Relu,
    Linear,
}

impl Layer {
    /// Create a new layer with random initialization
    pub fn new(input_size: usize, output_size: usize, activation: Activation) -> Self {
        use rand::Rng;
        let mut rng = rand::thread_rng();

        // Xavier initialization: scale = sqrt(2.0 / (input_size + output_size))
        let scale = (2.0 / (input_size + output_size) as f32).sqrt();

        let weights = na::DMatrix::from_fn(output_size, input_size, |_, _| {
            rng.gen_range(-scale..scale)
        });

        let biases = na::DVector::from_fn(output_size, |_, _| {
            rng.gen_range(-scale..scale)
        });

        Self {
            weights,
            biases,
            activation,
        }
    }

    /// Forward pass through this layer
    pub fn forward(&self, input: &na::DVector<f32>) -> na::DVector<f32> {
        // Linear transformation: y = Wx + b
        let linear_output = &self.weights * input + &self.biases;

        // Apply activation function
        match self.activation {
            Activation::Tanh => linear_output.map(|x| x.tanh()),
            Activation::Relu => linear_output.map(|x| x.max(0.0)),
            Activation::Linear => linear_output,
        }
    }

    /// Get total number of parameters in this layer
    pub fn param_count(&self) -> usize {
        self.weights.nrows() * self.weights.ncols() + self.biases.len()
    }

    /// Get all parameters as a flat vector
    pub fn get_params(&self) -> Vec<f32> {
        let mut params = Vec::with_capacity(self.param_count());

        // Add weights (row-major order)
        for i in 0..self.weights.nrows() {
            for j in 0..self.weights.ncols() {
                params.push(self.weights[(i, j)]);
            }
        }

        // Add biases
        for i in 0..self.biases.len() {
            params.push(self.biases[i]);
        }

        params
    }

    /// Set all parameters from a flat vector
    pub fn set_params(&mut self, params: &[f32]) {
        assert_eq!(params.len(), self.param_count(), "Parameter count mismatch");

        let mut idx = 0;

        // Set weights
        for i in 0..self.weights.nrows() {
            for j in 0..self.weights.ncols() {
                self.weights[(i, j)] = params[idx];
                idx += 1;
            }
        }

        // Set biases
        for i in 0..self.biases.len() {
            self.biases[i] = params[idx];
            idx += 1;
        }
    }
}

/// Simple Multi-Layer Perceptron for continuous control
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SimpleMLP {
    pub layers: Vec<Layer>,
    pub input_size: usize,
    pub output_size: usize,
}

impl SimpleMLP {
    /// Create a new MLP with the specified architecture
    ///
    /// # Arguments
    /// * `input_size` - Size of the input observation vector
    /// * `hidden_sizes` - Sizes of hidden layers (e.g., [128, 64])
    /// * `output_size` - Size of the output action vector
    pub fn new(input_size: usize, hidden_sizes: &[usize], output_size: usize) -> Self {
        let mut layers = Vec::new();

        // Input -> First hidden layer
        if let Some(&first_hidden) = hidden_sizes.first() {
            layers.push(Layer::new(input_size, first_hidden, Activation::Tanh));

            // Hidden -> Hidden layers
            for window in hidden_sizes.windows(2) {
                layers.push(Layer::new(window[0], window[1], Activation::Tanh));
            }

            // Last hidden -> Output (linear activation for continuous control)
            layers.push(Layer::new(
                *hidden_sizes.last().unwrap(),
                output_size,
                Activation::Linear,
            ));
        } else {
            // No hidden layers: direct input -> output
            layers.push(Layer::new(input_size, output_size, Activation::Linear));
        }

        Self {
            layers,
            input_size,
            output_size,
        }
    }

    /// Forward pass through the entire network
    pub fn forward(&self, input: &[f32]) -> Vec<f32> {
        assert_eq!(input.len(), self.input_size, "Input size mismatch");

        let mut activation = na::DVector::from_row_slice(input);

        for layer in &self.layers {
            activation = layer.forward(&activation);
        }

        activation.as_slice().to_vec()
    }

    /// Get total number of parameters in the network
    pub fn param_count(&self) -> usize {
        self.layers.iter().map(|l| l.param_count()).sum()
    }

    /// Get all parameters as a flat vector
    pub fn get_params(&self) -> Vec<f32> {
        self.layers
            .iter()
            .flat_map(|layer| layer.get_params())
            .collect()
    }

    /// Set all parameters from a flat vector
    pub fn set_params(&mut self, params: &[f32]) {
        assert_eq!(params.len(), self.param_count(), "Parameter count mismatch");

        let mut offset = 0;
        for layer in &mut self.layers {
            let layer_param_count = layer.param_count();
            layer.set_params(&params[offset..offset + layer_param_count]);
            offset += layer_param_count;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_layer_forward() {
        let layer = Layer::new(3, 2, Activation::Tanh);
        let input = na::DVector::from_vec(vec![1.0, 2.0, 3.0]);
        let output = layer.forward(&input);
        assert_eq!(output.len(), 2);
    }

    #[test]
    fn test_mlp_forward() {
        let mlp = SimpleMLP::new(10, &[64, 32], 5);
        let input = vec![0.1; 10];
        let output = mlp.forward(&input);
        assert_eq!(output.len(), 5);
    }

    #[test]
    fn test_param_serialization() {
        let mut mlp = SimpleMLP::new(5, &[8], 3);
        let original_params = mlp.get_params();

        // Modify params
        let mut new_params = vec![0.5; original_params.len()];
        mlp.set_params(&new_params);

        let retrieved_params = mlp.get_params();
        assert_eq!(retrieved_params, new_params);
    }
}
