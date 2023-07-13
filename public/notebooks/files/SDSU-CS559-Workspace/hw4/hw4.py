"""
Colin Casazza
ccasazza@sdsu.edu
red id: 818715736

CS 559
HW #4
11/19/18

see bottom of this page for written questions and further explanation...
"""
import cv2
import math
import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.signal import butter, lfilter
from skimage import data, feature, color, img_as_float
from skimage import filters
from matplotlib import pyplot as plt

def load_image(image_path):
    image = Image.open(image_path)
    return image


def save_image(image, save_path):
    image.save(save_path)


def image2pixelarray(filepath):

    im = Image.open(filepath).convert('L').copy()
    (width, height) = im.size
    greyscale_map = list(im.getdata())
    greyscale_map = np.array(greyscale_map)
    greyscale_map = greyscale_map.reshape((height, width))
    return greyscale_map


def averaging_filter(load_path, save_path):
    img = cv2.imread(load_path)

    kernel = np.ones((5, 5), np.float32) / 25
    dst = cv2.filter2D(img, -1, kernel)

    plt.subplot(121), plt.imshow(img), plt.title('Original')
    plt.xticks([]), plt.yticks([])
    plt.subplot(122), plt.imshow(dst), plt.title('Averaging')
    plt.xticks([]), plt.yticks([])
    plt.savefig(save_path)



'''
Generic butterworth bandpass filter from scipy. This filter took some experimenting to implement
an use. A lot of the information about butterworth filters available is being applied to a different domain,
like signal processing. This made determining the optimal 'lowcut', 'highcut', 'fs', and 'order,' parameters 
less intuitive, an I had to experiment to determine the optimal cutoff and order. ( see /outputs/tests/btr/ ) 
'''

def butter_bandpass(lowcut, highcut, fs, order):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    b, a = butter(order, [low, high], btype='band',analog=False)
    return b, a

def butter_bandpass_filter(data, lowcut, highcut, fs, order):
    b, a = butter_bandpass(lowcut, highcut, fs, order=order)
    y = lfilter(b, a, data)
    return y




"""
loads an image and generates the fft power spectrum then uses the fft spectrum
to mask the original image for low frequency components. mask out components using buttorworth filter Saves result to save path. 
"""
def fft_btr(load_path, save_path, low, high, res, order):

    img = cv2.imread(load_path, 0)
    img_original = img

    dft = cv2.dft(np.float32(img), flags=cv2.DFT_COMPLEX_OUTPUT)
    dft_shift = np.fft.fftshift(dft)

    magnitude_spectrum = 20 * np.log(cv2.magnitude(dft_shift[:, :, 0], dft_shift[:, :, 1]))
    print("MAX")
    print(max(magnitude_spectrum[0]))
    magnitude_spectrum = butter_bandpass_filter(magnitude_spectrum,low, high, res, order)

    rows, cols = img.shape
    crow, ccol = math.floor(rows/2), math.floor(cols/2)

    mask = np.zeros((rows,cols,2),np.uint8)
    mask[crow-30:crow+30, ccol-30:ccol+30] = 1

    fshift = dft_shift*mask
    f_ishift = np.fft.ifftshift(fshift)
    img_back = cv2.idft(f_ishift)
    img_back = cv2.magnitude(img_back[:, :, 0], img_back[:, :, 1])

    plt.subplot(131), plt.imshow(img_original, cmap='gray')
    plt.title('Input Image'), plt.xticks([]), plt.yticks([])
    plt.subplot(132), plt.imshow(magnitude_spectrum, cmap='gray')
    plt.title(''), plt.xticks([]), plt.yticks([])
    plt.subplot(133), plt.imshow(img_back, cmap='gray')
    plt.title(''), plt.xticks([]), plt.yticks([])
    plt.savefig(save_path)

'''
gaussian bypass operates on save principle as dog; bandpass filter = lowpass - highpass = dog filter
'''
def gaussian_bypass_prototype(save_path):
    original_image = img_as_float(data.chelsea())
    img = color.rgb2gray(original_image)
    k = 1.6
    plt.subplot(2, 3, 1)
    plt.imshow(original_image)
    plt.title('Original Image')

    for idx, sigma in enumerate([4.0, 8.0, 16.0, 32.0]):
        s1 = filters.gaussian(img, k * sigma)
        s2 = filters.gaussian(img, sigma)
        dog = s1 - s2
        plt.subplot(2, 3, idx + 2)
        plt.imshow(dog)
        plt.title('sigma=' + str(sigma) + ', k=' + str(k))

    plt.savefig(save_path)


''' PROBLEM 1
Please answer the following questions precisely. Support your answer with equations,
diagrams, etc, as appropriate.

    (a) Why is the assumption of image size as a power of 2 needed in Fast Fourier
    Transform (FFT)?

        We say the image must be sized as a power of two, because a square image is needed
        in order for us to be able to apply two orthogonal computation simultaneously. The image is
        decomposed into two dimensions and fft is applied to both.

    (b) Why is bit reversal needed for (FFT)?

        Bit reversal is used as a quick lookup mapping during fft

        We need to do this because FFT quadrants need to be reorganized from their original positions

        By reversing the bits of the original images array indexes, we get a convenient mapping for the
        rearrangement of quadrants required.

    (c) What is the ringing effect and how is it reduced?

        The ringing effect is a visual artifact produced by a sharp and sudden change in a filters'
        characteristics.

        It can be reduced by using butterworth filters or gaussian low pass filters which are both
        have more gradual cutoffs at higher frequencies.

    (d) What are spectrum power and its relation to information contents of the image?

        The power spectrum is a reduction on the original image that decomposes the images components
        into a distribution of their frequencies

        It provides information about artifacts in the image that may be frequently occurring, like
        an object of a solid color, and infrequent components like noise. Using this information
        we can often filter out infrequent components, making an image sharper.   
'''

''' PROBLEM 2

    The main difference between butterworth vs other low pass filters is that butterworth 
    filters are less effective (less sensitive) over larger sample area.


    
    To be honest, I had a lot of trouble implementing this filter, as the filter that I found
    in an existing library for python wasn't working as I needed, and when I finally got something
    that was able to remove some of the more periodic noise patterns in Blonde2, I was still having problems with 
    ringing and other artifacts that seemed to be out of place. We can especially see that 
    the butterworth filter I implemented left a string ringing pattern as opposed to the averaging filter
    which left subtle tile like artifacts. 
    
    Finding a way to set the low pass and high pass cutoffs dynamically would be important for this
    function to succeed because the critical values for these change a lot depending on the image you provide to this
    function
    

'''
def runProblem2():

    images = ['Blonde1', 'Blonde2', 'Flowers', 'Zebra']

    # apply fft filter to images
    def apply_btr(image):
        print(image)
        fft_btr('images/' + image + '.jpg', 'outputs/fft/' + image + '.png', 10, 200, 500, 5)

    for image in images:
        apply_btr(image)

    # apply spatial (averaging filter) to images
    def apply_avg_filter(image):
        averaging_filter('images/' + image + '.jpg', 'outputs/avg/' + image + '.jpg')
    for image in images:
        apply_avg_filter(image)


''' PROBLEM 3
Apply Gaussian high pass filter to Flowers.jpg accompanying this assignment, and
discuss your results and the effect of cutoff frequency.

The effect of adjusting the cutoff frequency:
    - lower cutoff has more contrast between edges and the rest of the image
    but is more sensitive to noise.
    - higher cutoff frequencies produce images that are more smoothed out 
    but have less relative contrast between edges and the rest of the image.
'''
def runProblem3():

    def plot(data, title):
        plot.i += 1
        plt.subplot(2, 2, plot.i)
        plt.imshow(data)
        plt.gray()
        plt.title(title)
    plot.i = 0

    im = Image.open('images/Flowers.jpg')
    plot(im, 'Original')
    data = np.array(im, dtype=float)

    lowpass = ndimage.gaussian_filter(data, 3)
    gauss_highpass = data - lowpass
    plot(gauss_highpass, r'Gaussian High pass, sigma = 3 p')

    lowpass2 = ndimage.gaussian_filter(data, 9)
    gauss_highpass2 = data - lowpass2
    plot(gauss_highpass2, r'Gaussian High pass, sigma = 9 ')

    lowpass3 = ndimage.gaussian_filter(data, 27)
    gauss_highpass3 = data - lowpass3
    plot(gauss_highpass3, r'Gaussian High pass, sigma = 27')

    plt.savefig('outputs/flower_gaussian.png')


''' PROBLEM 4
(a) Propose the equation of a Gaussian bandpass filter with a bandwidth w and cutoff
frequency ro .

A simple bandpass filter can be achieved by taking a gaussian filter with a small std, 
and a gaussian filter with a high std, applying both to the image, then taking the difference
The resulting image will be a bandpass filter.

(b) Demonstrate the usefulness of the Gaussian bandpass filter using an image of your
choice. Discuss the results.

Bandpass filters are a sort of two in one combination filter mask. Bandpass filters are used to 
enhance edges while reducing noise through out the image. 

The use of the gaussian filter in this bandpass filter is most generally, to attenuate the high
frequency components of the image, thus smoothing out the noise in the image. 
The use of the gaussian filter is often better than other noise reducing filters in this case,
because gaussian filters reduces the ringing effect because the gaussian function has the same 
shape in the spatial domain and the fourier domains.


'''
def runProblem4():
    gaussian_bypass_prototype('outputs/gaussian_proto.png')

runProblem2()
runProblem3()
runProblem4()


"""
other stuff
"""
# lets test a bunch of butterworth filter params
#
# def apply_btr_tests(img, lo, hi, res, order):
#     img = img.copy()
#     image_filtered = butter_bandpass_filter(img, lo, hi, res, order)
#     image_to_save = Image.fromarray(image_filtered).convert('RGB')
#     save_image(image_to_save, 'outputs/tests/btr/[' + str(lo) + "," + str(hi) + "," + str(res) + "," + str(order) + "].jpg")
#z
#
# i = 1
# while i < 10:
#     j = 500
#     while j < 1000:
#         z = 100
#         while z < 255:
#             y = 1
#             while y < 150:
#                 img = image2pixelarray('images/Zebra.jpg')
#                 apply_btr_tests(img, y, z, j, i)
#                 y = y + 12
#             z = z + 20
#         j = j + 200
#     i = i + 1

