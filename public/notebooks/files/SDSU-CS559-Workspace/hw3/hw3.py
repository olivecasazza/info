import math
from matplotlib import pyplot as plt
import matplotlib.image as mpimg
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import cv2
import random
import time
import datetime

def get_gx_image(image):
    new_image = image.copy()
    width, height = image.size

    x = 1
    y = 1
    new = []
    while(y<height-1):
        x = 1
        row = []
        while(x<width-1):
            pixel = ((-1 * image.getpixel( (x-1, y-1) )) +
            (-2 * image.getpixel( (x-1, y) )) +
            (-1 * image.getpixel( (x-1, y+1) )) +
            (1 * image.getpixel( (x+1, y-1) )) +
            (2 * image.getpixel( (x+1, y) )) +
            (1 * image.getpixel( (x+1, y+1) )))

            new_image.putpixel( (x,y) , pixel)

            x = x + 1
        y = y + 1
            
    return new_image

def get_gy_image(image):
    new_image = image.copy()
    width, height = image.size

    x = 1
    y = 1
    new = []
    while(y<height-1):
        x = 1
        row = []
        while(x<width-1):
            pixel = ((-1 * image.getpixel( (x-1, y-1) )) +
            (-2 * image.getpixel( (x, y-1) )) +
            (-1 * image.getpixel( (x+1, y-1) )) +
            (1 * image.getpixel( (x-1, y+1) )) +
            (2 * image.getpixel( (x, y+1) )) +
            (1 * image.getpixel( (x+1, y+1) )))

            new_image.putpixel( (x,y) , pixel)

            x = x + 1
        y = y + 1
            
    return new_image

def combine_gx_gy_image(image_gx, image_gy):
    new = image_gx
    width, height = image_gx.size

    for y in range(height):
        for x in range(width):
            nx = image_gx.getpixel((x,y))
            ny = image_gx.getpixel((x,y))
            pixel = math.sqrt((nx*nx) + (ny*ny))
            new.putpixel( (x,y) , int(pixel) )
    
    return new

def salt_pepper_noise(image):
    new = image.copy()
    width, height = image.size

    for y in range(height):
        for x in range(width):
            rand = random.randint(0,100)
            if rand >= 20:
                new.putpixel( (x,y) , image.getpixel( (x,y) ) )   
            if(rand < 20):
                new.putpixel( (x,y) , (0,0,0) )

    return new

def convertToGreyScale(in_path, out_path):
    # open file
    img = mpimg.imread(in_path)     
    
    # maps rgb values to rgb to greqscale formula coeificients
    gray = np.dot(img[...,:3], [0.299, 0.587, 0.114])

    # get the greyscale pixel mappings
    plt.imshow(gray, cmap = plt.get_cmap("gray"))

    # convert to true greyscale  (smaller footprint) and save image
    Image.fromarray(gray).convert("L").save(out_path)
  

# convert image to greyscale and open
convertToGreyScale("./inputs/flowers.jpg", "./inputs/flowers_grey.jpg")
image = Image.open("./inputs/flowers_grey.jpg")

# get both directions of the edge gradient and combine
get_gx_image(image).save("./outputs/gx_filtered.jpg")
get_gy_image(image).save("./outputs/gy_filtered.jpg")
combine_gx_gy_image(get_gx_image(image),get_gy_image(image)).save("./outputs/flower_edges.jpg")

# with noise...
image = Image.open("./inputs/flowers.jpg")
salt_pepper_noise(image).save("./inputs/salt_pepper_flower.jpg")
convertToGreyScale("./inputs/salt_pepper_flower.jpg", "./inputs/flowers_salt_pepper_grey.jpg")

salt_pepper_noise = Image.open("./inputs/flowers_salt_pepper_grey.jpg")

salt_pepper_noise = salt_pepper_noise.filter(ImageFilter.MedianFilter(size=3))
salt_pepper_noise.save("./inputs/salt_pepper_flower_filtered.jpg")

get_gx_image(salt_pepper_noise).save("./outputs/get_gx_salt_pepper_image.jpg")
get_gy_image(salt_pepper_noise).save("./outputs/get_gy_salt_pepper_image.jpg")

combine_gx_gy_image(get_gy_image(salt_pepper_noise),get_gy_image(salt_pepper_noise)).save("./outputs/flower_salt_pepper_edges.jpg")

