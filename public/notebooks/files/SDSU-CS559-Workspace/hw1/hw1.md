
# CS559 - Computer Vision

**Colin Casazza** - *Final work* - CS559 Computer Vision

Assignment 1

Due 9/19/2018

*See hw1.py for coded sction of this assignment* 

---
### Question 1:
```
Consider a square region of size m by m pixels in each  of two images f1(x,y) and f2(x,y). The RGB colors of these two regions are denoted by R1(x,y), G1(x,y), B1(x,y) and R2(x,y), G2(x,y), B2(x,y), where (x0,y0) is the position of the upper left corner of the square region,and (x,y) is the position of a typical pixel in the region, i.e. x=x0, x0+1, …, x0+m-1and y=y0, y0+1, …, y0+m-1 .  

Propose a measure for the similarity between the colors of these two regions. Express the measure in analytical form and explain why your measure is appropriate. If two regions are very similar by your measure, will that mean that they are visually similar?
```
### Answer:
```
To compare the two images, it woulr be usefull to normalize the two images to the same dimensions so you don't analytically have to deal with the differences in size between the two images while comparing. Take the smaller image and scale it by a factor k x j such that f1 and f2 have the same size.

To take a simple comparison to see the differences in colors between the two images, we could take a pixel color histogram of these two images and for any color compare the amount of that pixel in the image, or algorymthically, take the absolute value of the difference between each index of the two pixel color histogram. With that percent difference mapping, we can sumate the values into an average difference quanty.

With this approach, we will not be able to see if the images are visually similar, only similarities in their color compositions. To get an idea of visual similarity, we'll need a different approach. Compairing color, and location of a pixel is required to compare visual simaliarity.

We could take the two normalized photos and for each pixel index, find the average difference in pixel color between the two photos in the same locataion. Take this average and add it to a running sum. When we're done, we'll have a running total of the percent differences of pixel color for each location, which tells us if, on average, if the two photos have the same colors in the same locations.
```
---
### Question 2:
```
In an automated manufacturing, inspection of circuit boards is to be done using a CCD camera. The individual imaging elements (photosites) each has a dimension of 5 by 5 m (micron) and the spacing between the elements is 1 m. The circuit boards are 60 by 60 mm, and defects appear as dark circular blobs with diameter of 0.4 mm or larger. The smallest defect must appear in the image as an area of at least 6 by 6 pixels.

Assume that available lenses come with focal lengths of multiple of 25 mm, 35 mm and 50 mm, and the available camera resolutions are multiple of 256 by 256 pixels up to 2048 by 2048 pixels (4 Mpix).  Manufacturing requirements dictate that distance between camera and the circuit board must be between 200 mm to 500 mm. The image of the board must occupy the whole image plane. You are to select the lens focal length and the minimum camera resolution (number of pixels) required. Show in reasonable details the analysis that lead to your answers.

```
### Answer: 

```
 First calculate the required anount of pixels/resolution needed for the sensor...
```

$$ 
spatialResolution = featureResolution / featurePixels = 0.4(mm) / 6(pixel) = 0.067(mm/pixel) $$

$$ spatialResolution = 0.4(mm) / 6(pixel) = 0.067(mm/pixel) $$


$$
imageSensorResolution = FOV(mm) / Rs(mm/pixel) = 60 / 0.067 = 900(pixels) $$


$$
imageSensorResolution = 60(mm) / 0.067(mm pixels) = 900(pixels) $$

```
 Using the calculated resolution, assuming we're using a lense with a 25mm focal length, we can find the working distance for the sensor...
```

$$
Fl = (sensorSize * workingDistance)/ fieldOfView)  $$

$$
Fl = ((0.006(mm) * 900(pixels)) * 200(mm)) / 60(mm) 
$$

$$
Fl * 60(mm)= 5.4(mm pixels) * workingDistance
$$

$$
25(mm)* 60(mm) / 5.4(mm pixels)  = workingDistance
$$

$$
277.78(mm) = workingDistance
$$

---
