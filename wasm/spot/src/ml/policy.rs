use tract_onnx::prelude::*;

/// Policy interface for robot control
/// Can be backed by ONNX models, genetic algorithms, or hand-coded logic
pub struct Policy {
    model: Option<SimplePlan<TypedFact, Box<dyn TypedOp>, Graph<TypedFact, Box<dyn TypedOp>>>>,
    input_size: usize,
    output_size: usize,
}

impl Policy {
    /// Create a new policy from an ONNX model file
    ///
    /// This allows you to train a model in PyTorch/TensorFlow and export it:
    /// ```python
    /// import torch
    /// import torch.onnx
    ///
    /// model = YourPolicyNetwork()
    /// dummy_input = torch.randn(1, obs_size)
    /// torch.onnx.export(model, dummy_input, "policy.onnx")
    /// ```
    pub fn from_onnx(onnx_bytes: &[u8]) -> Result<Self, Box<dyn std::error::Error>> {
        log::info!("Loading ONNX model ({} bytes)", onnx_bytes.len());

        let model = tract_onnx::onnx()
            .model_for_read(&mut &onnx_bytes[..])?
            .into_optimized()?
            .into_runnable()?;

        // RLlib models have dynamic batch dimensions, so we hardcode the expected sizes
        // Observation: 42 floats (3 gravity + 12 joint pos + 12 joint vel + 12 prev action + 3 command)
        // Action: 12 floats (joint targets)
        let input_size = 42;
        let output_size = 12;

        log::info!("ONNX model loaded: input_size={}, output_size={}", input_size, output_size);

        Ok(Self {
            model: Some(model),
            input_size,
            output_size,
        })
    }

    /// Create a standing/idle policy (outputs zero targets)
    /// Useful for testing the pipeline before you have a trained model
    pub fn standing(obs_size: usize, action_size: usize) -> Self {
        Self {
            model: None,
            input_size: obs_size,
            output_size: action_size,
        }
    }

    /// Run inference: observation -> action
    pub fn forward(&self, observation: &[f32]) -> Result<Vec<f32>, Box<dyn std::error::Error>> {
        if let Some(model) = &self.model {
            // Create tensor from observation
            let input = tract_ndarray::Array2::from_shape_vec(
                (1, self.input_size),
                observation.to_vec(),
            )?;

            // Run inference
            let result = model.run(tvec![Tensor::from(input).into()])?;

            // Extract output
            let output = result[0]
                .to_array_view::<f32>()?
                .iter()
                .cloned()
                .collect::<Vec<_>>();

            Ok(output)
        } else {
            // Standing policy: return zeros
            Ok(vec![0.0; self.output_size])
        }
    }

    /// Get input observation size
    pub fn input_size(&self) -> usize {
        self.input_size
    }

    /// Get output action size
    pub fn output_size(&self) -> usize {
        self.output_size
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_standing_policy() {
        let policy = Policy::standing(30, 12);
        let obs = vec![0.0; 30];
        let action = policy.forward(&obs).unwrap();
        assert_eq!(action.len(), 12);
        assert!(action.iter().all(|&x| x == 0.0));
    }
}
