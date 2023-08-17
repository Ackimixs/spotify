import { createCanvas, loadImage } from "canvas";

export const getAvgColor = async (
  imagePath: string
): Promise<string | null> => {
  try {
    const img = await loadImage(imagePath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
    const numPixels = img.width * img.height;

    let totalR = 0;
    let totalG = 0;
    let totalB = 0;

    for (let i = 0; i < numPixels * 4; i += 4) {
      totalR += imageData[i];
      totalG += imageData[i + 1];
      totalB += imageData[i + 2];
    }

    const avgR = Math.floor(totalR / numPixels);
    const avgG = Math.floor(totalG / numPixels);
    const avgB = Math.floor(totalB / numPixels);

    const hexColor = `#${((avgR << 16) | (avgG << 8) | avgB)
      .toString(16)
      .padStart(6, "0")}`;

    return hexColor;
  } catch (error) {
    console.error("Average color Error:", error);
    return null;
  }
};
