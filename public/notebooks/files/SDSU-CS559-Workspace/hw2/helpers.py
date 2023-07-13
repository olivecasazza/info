from matplotlib import pyplot as plt
import matplotlib.image as mpimg
from PIL import Image, ImageDraw
import numpy as np
import cv2
import random
import time
import datetime


def contours(in_path, out_path):
    tmp = cv2.imread(in_path)
    tmpgray = cv2.cvtColor(tmp, cv2.COLOR_BGR2GRAY)
    ret, thresh = cv2.threshold(tmpgray, 127, 255, 0)
    tmp2, contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    cv2.imwrite(out_path,tmp2)

# param:image - path of the image to find the object in
# param:template - path of the template image to find in the target image
# param:out_path - path to save a visuilization of the analysis results
# param: resolution - integer number used to specify depth of search
def getXLocation(image, template, out_path, samples):

    # open files and create a pixel buffer
    image = Image.open (image)
    template = Image.open (template)
    pixels = []

    # read over the template image taking random pixels
    # for a certain number of samples
    while len(pixels) < samples:
        
        # random pixel in template
        (x,y) = random.randint (0, template.size [0] - 1), random.randint (0, template.size [1] - 1)
        pixel = template.getpixel((x, y))

        # if the last element is over out threshhold
        # add it to the sample array
        if pixel[-1] > 200:
            pixels.append(((x, y), pixel[:-1]))

    # diff calculates a hash difference of a pixel matrix
    # used to determine the similarity of a target pixel matrix
    # and template pixel matrix
    # returning a scalar result that we can use 
    def diff (a, b):
        return sum ( (a - b) ** 2 for a, b in zip (a, b) )

    # array for storing the sample matches with the lowest dif
    best = []

    # for all pixels in target image
    for x in range (image.size[0]):
        for y in range (image.size[1]):
            d = 0
            # for each pixel in the template sample set
            for coor, pixel in pixels:
                try:
                    # get each pixel and compare using our diff
                    ipixel = image.getpixel((x + coor [0], y + coor [1]))
                    # aggregate for the while square of template sample and target image
                    d += diff (ipixel, pixel)
                except IndexError:
                    d += 256 ** 2 * 3
            
            # add the aggregated diff to results
            best.append ( (d, x, y) )
            # sort the results
            best.sort (key = lambda x: x [0] )
            # take the three results with the lowest diffs
            best = best [:3]

    # draw a rectangle around the result of the analysis and save image
    draw = ImageDraw.Draw (image)
    for best in best:
        x, y = best [1:]
        print("x: " + str(x))
        draw.rectangle ( (x, y, x + template.size [0], y + template.size [1] ), outline = 'red')
    image.save (out_path)
    
    return x

# param 1: path of colored image to convert to greyscale
# param 2: path to save the new greyscale image to
def convertToGreyScale(in_path, out_path):
    # open file
    img = mpimg.imread(in_path)     
    
    # maps rgb values to rgb to greqscale formula coeificients
    gray = np.dot(img[...,:3], [0.299, 0.587, 0.114])

    # get the greyscale pixel mappings
    plt.imshow(gray, cmap = plt.get_cmap('gray'))

    # convert to true greyscale  (smaller footprint) and save image
    Image.fromarray(gray).convert("L").save(out_path)