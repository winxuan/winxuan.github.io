---
title: 最低有效位（LSB）隐写术将信息藏在PNG图片中
date: 2024-6-12 12:00:00 +0800
categories: [Tips, System]
tags: [tips]
---

## 编解码python脚本

ecode.py 编码脚本：将1000个字母写入到图片中

```python
from PIL import Image
import numpy as np

def text_to_bits(text, encoding='utf-8', errors='surrogatepass'):
    bits = bin(int.from_bytes(text.encode(encoding, errors), 'big'))[2:]
    return bits.zfill(8 * ((len(bits) + 7) // 8))

def embed_text_in_image(image_path, output_path, text):
    img = Image.open(image_path)
    img = img.convert('RGBA')
    pixels = np.array(img)

    text += chr(0)  # Add a null character as a terminator
    bits = text_to_bits(text)
    
    if len(bits) > pixels.size * 3:
        raise ValueError("Text is too long to be embedded in the given image.")

    bit_index = 0
    for i in range(pixels.shape[0]):
        for j in range(pixels.shape[1]):
            if bit_index < len(bits):
                for k in range(3):  # Only modify the RGB channels
                    if bit_index < len(bits):
                        pixels[i, j, k] = (pixels[i, j, k] & ~1) | int(bits[bit_index])
                        bit_index += 1
            else:
                break

    img = Image.fromarray(pixels)
    img.save(output_path)

# Example usage
text = "m" + "A" * 998 + "M"  # 1000 letters
embed_text_in_image('demo.png', 'demo_embedded.png', text)

```

decode.py 解码脚本：读取出上段代码中写入字符信息

```python
from PIL import Image
import numpy as np

def bits_to_text(bits, encoding='utf-8', errors='ignore'):
    n = int(bits, 2)
    return n.to_bytes((n.bit_length() + 7) // 8, 'big').decode(encoding, errors) or '\0'

def extract_text_from_image(image_path):
    img = Image.open(image_path)
    img = img.convert('RGBA')
    pixels = np.array(img)

    bits = ''
    bit_index = 0
    for i in range(pixels.shape[0]):
        for j in range(pixels.shape[1]):
            for k in range(3):  # Only read the RGB channels
                bits += str(pixels[i, j, k] & 1)
                bit_index += 1

    text = bits_to_text(bits)

    # Find the null character and strip off any extra bits
    null_index = text.find(chr(0))
    if null_index != -1:
        text = text[:null_index]

    return text

# Example usage
extracted_text = extract_text_from_image('demo_embedded.png')
print(extracted_text)
```

## 图片相似度验证

因为LSB隐写术是一种对图片有损的写入方法，这里用脚本比较下原图和编码后的图片相似度

以下是一个使用SSIM和MSE来比较两个图片相似度的脚本：

```python
import numpy as np
from skimage.metrics import structural_similarity as ssim
from skimage.io import imread
from skimage.color import rgb2gray
import cv2

def mse(imageA, imageB):
    # The 'Mean Squared Error' between the two images is the sum of the squared difference between the two images
    err = np.sum((imageA.astype("float") - imageB.astype("float")) ** 2)
    err /= float(imageA.shape[0] * imageA.shape[1])
    return err

def compare_images(imageA, imageB):
    # If the images have 4 channels (RGBA), convert them to 3 channels (RGB)
    if imageA.shape[2] == 4:
        imageA = cv2.cvtColor(imageA, cv2.COLOR_RGBA2RGB)
    if imageB.shape[2] == 4:
        imageB = cv2.cvtColor(imageB, cv2.COLOR_RGBA2RGB)
    
    # Convert the images to grayscale
    imageA_gray = rgb2gray(imageA)
    imageB_gray = rgb2gray(imageB)
    
    # Compute the mean squared error and structural similarity index
    m = mse(imageA_gray, imageB_gray)
    s = ssim(imageA_gray, imageB_gray, data_range=imageA_gray.max() - imageA_gray.min())

    return m, s

# Load the two input images
imageA = imread('demo.png')
imageB = imread('demo_embedded.png')

# Compare the images
mse_value, ssim_value = compare_images(imageA, imageB)

print(f"Mean Squared Error (MSE): {mse_value}")
print(f"Structural Similarity Index (SSIM): {ssim_value}")
```

MSE（均方误差）：计算两张图片之间像素差的平方平均值。值越低，图片越相似。

SSIM（结构相似性指数）：衡量两张图片的结构相似度，值在-1到1之间，值越高，图片越相似。

运行脚本得到相似度结果：

```
Mean Squared Error (MSE): 6.036087972159335e-09
Structural Similarity Index (SSIM): 0.9999990593112368
```

6.036087972159335e-09是科学计数法，意思是6.036087972159335乘以10的负9次方

作为对比，两张相同的图片结果是

```
Mean Squared Error (MSE): 0.0
Structural Similarity Index (SSIM): 1.0
```