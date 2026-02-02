//! Spot robot WASM simulation - Bevy 3D + Rapier physics.

pub mod controller;
pub mod physics;
pub mod urdf;
pub mod config;
pub mod ml;

// Bevy modules
pub mod camera;
pub mod render;
pub mod scene;
pub mod input;
pub mod simulation;
pub mod ui;
pub mod hand_drawn;

mod web_bevy;
pub use web_bevy::{WebHandle, SpotState};
