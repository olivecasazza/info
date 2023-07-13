
# import all the functions we used in this assignment
from helpers import *


# problem one
# see helpers.py for description of this
convertToGreyScale('./colors/colored_image.jpg',"./colors/greyscale_image.jpg")

# problem two

# assumption: we know the timestamp for car_1.png and car_2.png
# assumption: for this demo we'll create two timestamps about 0.25 seconds apart for each image

# very crude way to produce two timestamps 250 ms apart
# time stamp for image 1
t1 = time.time()
time.sleep(0.25)
# timestamp for image 2
t2 = time.time()

# see helpers.py for description
x1 = getXLocation("./cars/car_1a.png","./cars/templates/car_template.png", "./cars/out/car1a_out.png", 10)
x2 = getXLocation("./cars/car_1b.png","./cars/templates/car_template.png", "./cars/out/car2a_out.png", 10)

# calculate the time difference between the two images
delta_x = abs(x2 - x1)
delta_time = abs(t2 -t1)

print("__delta time__")
print(delta_time)

# calculate velocity (pixels per ms)
speed = delta_x / delta_time

print("-----------")
print("__delta xa__")
print(delta_x)

print("__speed of the car a__")
print(str(round(speed)) + " pixels / ms")

# try it again with different template file to see how template affects analysis
# the second analysis (b) uses a smaller template (just the wheel of the car)
# this process distinctly prone to errors as the wheel template is more easily matched
# with generic shapes in the background of the image
# in this trial, we can see that ./cars/out/car2b_out was matched incorectly
# producting a incorrect speed

# # by experimenting with different combinations of templates and contour filters
# # we can fine tune the analysis process and reduce the tendency for incorrect matches
x1b = getXLocation("./cars/car_1a.png","./cars/templates/car_template_wheel.png", "./cars/out/car1b_out.png", 10)
x2b = getXLocation("./cars/car_1b.png","./cars/templates/car_template_wheel.png", "./cars/out/car2b_out.png", 10)

delta_xb = abs(x2b - x1b) 
delta_time = abs(t2 -t1)

speedb = delta_xb / delta_time

print("-----------")
print("__delta xb__")
print(delta_xb)

print("__speed of the car b__")
print(str(round(speedb)) + " pixels / ms")