"""
Author: Colin Casazza
Date: 9/17/18
Course: CS559 MW 5:30
RedID: 818715736

Assignment: HW1
"""

from PIL import Image

# This is a function used to reflect an image about it's x axis.
# This function was used to answer problem 3 in the homework
def reflect_x_axis(image):
  # use a copy of image to create the mirror image in
  new_image = image.copy()
  width, height = image.size
  # for each pixel, reflect over x axis
  # (x,y) -> (x, height - y - 1)
  for y in range(height):
      for x in range(width):
          (r, g, b) = image.getpixel((x, y))
          new_image.putpixel((x, height - y - 1), (r, g , b))
          
  return new_image

# This is a function used to enlarge/scale an image by an integer factor
# of k. This function was used to answer problem 4 in the homework
def scale_image_by_k(image, k):
  # get origional dimensions
  width, height = image.size
  # calculate new scaled image dimenstions
  new_width, new_height = map(lambda x: x * k, image.size)
  # create new images with scaled width and height
  new_image = Image.new("RGB", (new_width, new_height))
  for y in range(height):
    for x in range(width):
      (r, g, b) = image.getpixel((x, y))
      # put in a k by k sized square into new_image 
      # starting at (x * 3, y * 3)
      for i in range(k):
        for j in range(k):
          new_image.putpixel((x * k + i, y * k + j), (r, g , b))

  return new_image

# Problem 1
# Reflection (32 points)
# Write a program to perform reflection of an image about its x-axis.  
# See Fig. 2 in Chapter 3 Lecture Notes. 
# Apply your program to an image of your choice to demonstrate the reflection.

# load initial image
image_to_reflect = Image.open("./images/image.jpeg")

# flip image and save
image_flipped = reflect_x_axis(image_to_reflect)
image_flipped.save('./images/image_flipped.jpeg')

# Problem 2
# Write a program that takes an RGB image of size W by H and an integer k and produces an output image of size 
# kW by kH where k is an integer greater than one (sometime this is called resampling). The enlarged image must be in appearance as close as possible 
# to the original image. Use bilinear interpolation or another technique of your choice.  Demonstrate your work by producing an input image and two 
# output images one with k=2 and one with k=3.

# load initial image
image_to_scale = Image.open("./images/image.jpeg")

# scale by 2 and save
image_scalled_by_2 = scale_image_by_k(image_to_scale, 2)
image_scalled_by_2.save('./images/image_scalled_by_2.jpeg')

# scale by 3 and save
image_scalled_by_3 = scale_image_by_k(image_to_scale, 3)
image_scalled_by_3.save('./images/image_scalled_by_3.jpeg')


# scale by 10 and save
image_scalled_by_10 = scale_image_by_k(image_to_scale, 10)
image_scalled_by_10.save('./images/image_scalled_by_10.jpeg')