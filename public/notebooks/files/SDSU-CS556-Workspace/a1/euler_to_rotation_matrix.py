import numpy as np
import math as math


def euler_to_rotation_matrix(α, β, γ):
    # convert the degree inputs to radians
    # for math.sin and math.cos
    α = math.radians(α)
    β = math.radians(β)
    γ = math.radians(γ)

    # find the discrete vector
    # components for the rotation matrix
    Rx = np.array([
        [1, 0, 0],
        [0, math.cos(γ), -math.sin(γ)],
        [0, math.sin(γ), math.cos(γ)]
    ])

    Ry = np.array([
        [math.cos(β), 0, math.sin(β)],
        [0, 1, 0],
        [-math.sin(β), 0, math.cos(β)]
    ])

    Rz = np.array([
        [math.cos(α), -math.sin(α), 0],
        [math.sin(α), math.cos(α), 0],
        [0, 0, 1]
    ])

    # combine the discrete components by
    # taking the dot product
    return np.dot(np.dot(Rz, Ry), Rx)
