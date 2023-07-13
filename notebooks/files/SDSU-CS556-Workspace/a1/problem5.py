from scipy.spatial.transform import Rotation as R
import numpy as np

# custom defined functions
from euler_to_rotation_matrix import euler_to_rotation_matrix
from rotation_matrix_to_euler import rotation_matrix_to_euler

"""
Colin Casazza
cs556 Assignment One

note: for problems a.i and b, I used scipy functions
to achieve conversion from euler angles to rotation
matricies and vice versa for simplicity. I've also
written custom functions for these operations ( which
defined and tested in line with the scipy useage )
"""

# a.i)
print('------------------------------------')
print('a.i) rotation matrix from euler angles...')
# compute the rotation matrix for the
# test case for α=10; β=20; γ=30
# (all inputs are in degrees)
r = R.from_euler('ZYX', (10, 20, 30), degrees=True)
print(r.as_dcm())
print('does custom function match scipy function...')
print(np.allclose(r.as_dcm(), euler_to_rotation_matrix(10, 20, 30)))
print('------------------------------------')

# a.ii)
print('------------------------------------')
print('a.ii) show the number of independent values in the rotation matrix...')
# determine the number of independent values by
# finding the rank of the matrix
print(np.linalg.matrix_rank(r.as_dcm()))
print('------------------------------------')

# a.iii)
print('------------------------------------')
print('a.iii) show that the inverse and transpose of Ra,b are equal...')
# find the transpose and inverse of
# the rotation matricies
r_inverse = np.transpose(r.as_dcm())
r_transpose = np.linalg.inv(r.as_dcm())
# test to see if np matricies are
# numerically equal
print(np.allclose(r_inverse, r_transpose))
print('------------------------------------')

# b)
print('------------------------------------')
print('b) euler angles from rotation matrix...')
# convert the rotation matrix back into
# euler angles
euler_angles = r.as_euler('ZYX', degrees=True)
print(euler_angles)
print('does custom function match scipy function...')
print(np.allclose(euler_angles, rotation_matrix_to_euler(r.as_dcm())))
print('------------------------------------')
