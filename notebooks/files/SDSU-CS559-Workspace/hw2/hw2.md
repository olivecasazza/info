
# CS 559 Computer Vision
Hw # 2
---
---
Colin Casazza
818715736
10/2/18
---
## Problem 1
a)  What is an interchange format?  
```
An interchange format is a common interface through which various software and hardware can communicate. Because Objects in an interchange format adhere to a common pattern, users using this format can exchange data with ease.
```
b) Give three examples of interchange formats?
```
-   Data interchange file format used to transfer workbooks and other chunks of data over a common interface. Generally objects represented in data interchange format are two or three line chunks of ASCII encoded data.
-   JSON - Javascript object notation is a popular interchange format commonly used to pass data between users in the web or in other non-time-contricted tasks.
-   XML - Similar to JSON but works with opening and closing tags to create key-value pairs. Used in older web applications in as a common configuration file format.

```
c) What is the signature of a PMG format? Give two examples.
```
header columns:
    a)  A "magic number" for identifying the file type. A pgm image's magic number is the two characters "P5".
    b)  Whitespace (blanks, TABs, CRs, LFs).
    c)  A width, formatted as ASCII characters in decimal.
    d)  Whitespace.
    e)  A height, again in ASCII decimal.
    f)  Whitespace.
    g)  The maximum gray value in ASCII decimal. Must be less than 65536, and more than zero.
    h)  A single whitespace character (usually a newline)
    
signature examples (no magic number [p5]):
    -   50 35 0A
    -   4E 3A 05

HEADER DEFINITION FROM C SPEC -> http://netpbm.sourceforge.net/doc/libpgm.html
```
---
## Problem 2
a) What is patterning in printing?
```
Printing is a process by which printing hardware reduces the quantatization of an image. Because a printer can only represent a pixel in a limited number of colors, an image needs to be reduced to a compress format with a reduced number of dimensions.
```
b) What is a dither matrix and how is it used?
```
For every pixel in the image the value of the pattern at the corresponding location is used as a threshold. Neighboring pixels do not affect each other, making this form of dithering suitable for use in animations. Different patterns can generate completely different dithering effects. Though simple to implement, this dithering algorithm is not easily changed to work with free-form, arbitrary palettes.

REF -> http://www.efg2.com/Lab/Library/ImageProcessing/DHALF.TXT
```
c) Explain the principle and operation of error diffusion for printing.
```
Error diffusion takes a monochrome or color image and reduces the number of quantization levels. A popular application of error diffusion involves reducing the number of quantization states to just two per channel. 

For example, if you'd like to print an rgb photo with a black and white photo, you could attempt to reduce the quantatizations per pixel down to two (black and white). Error diffusion is an area operation per pixel, so each pixel is reduced in a way that takes into account the pixels and their colors in an area around it. 
```
---
## Problem 3
Explain conditions under which the use of a lookup table (LUT), instead of calculating the mapping pixel by pixel, reduces the computation.Express the conditions in terms of number of graylevels (L) and resolution n.
```
-   If you have a 1920x1080 image, that has a 8 bit RGB color representation.
-   You'd like to apply an arbitrary pixel mapping that applys the square root to (R*G*B)
-   RGB can be between 0 and 512, given the possible combinations of R, G, and B
-   Create a lookup table where for all elements in array[R][G][B] == sqrt(R*G*B)
-   Now we only need to make 512 sqrt operations (8*8*8) instead of 1920*1080 sqrt operations.
```
---
## Problem 4
```
*attached with assignment*
```
---
## Problem 5
```
*attached with assignment*
```
---
## Programs
```
* detialed descirptions of programs can be found in the comments of hw2.py, which is included with the flashdrive submitted with this assignment. *
```****