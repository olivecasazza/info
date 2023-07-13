import math as math
import numpy as np


def rotation_matrix_to_euler(r):
    # extract individual components from rotation matrix
    q = math.sqrt(r[0, 0] * r[0, 0] + r[1, 0] * r[1, 0])
    x = math.atan2(r[2, 1], r[2, 2])
    y = math.atan2(-r[2, 0], q)
    z = math.atan2(r[1, 0], r[0, 0])

    # convert radians into degrees
    x = math.degrees(x)
    y = math.degrees(y)
    z = math.degrees(z)
    return np.array([z, y, x])
