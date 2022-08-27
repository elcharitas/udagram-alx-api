import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import Jimp from "jimp";

// valid regex for urls
const VALID_URL_REGEX = /^htt(p|ps):\/\/.{3,}\..{3,8}/;

/**
 * use regex to validate a url input
 *
 * @param url
 */
export const validateUrl = (url: string) => url && VALID_URL_REGEX.test(url);

/**
 * Generates a image random path
 */
export const randomPath = () =>
  "../tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      /**
       * Jimp read Image
       *
       * Having Jimp read the image is faster but it may result in errors
       * So, read image with jimp. If an error is thrown,
       * attempt to read fetch the image buffer and read that instead
       */
      const photo = await Jimp.read(inputURL).catch(async () => {
        const imageResp = await fetch(inputURL);
        const imageBuffer = await imageResp.arrayBuffer();
        return Jimp.read(imageBuffer);
      });
      const filepath = randomPath();
      const outpath = path.resolve(__dirname, filepath);
      await photo
        .resize(256, 256) // resize
        .quality(80) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, () => {
          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
export async function deleteLocalFiles() {
  const tmpDir = path.resolve(__dirname, "../tmp/");
  return new Promise((resolve, reject) => {
    fs.readdir(tmpDir, (error, files) => {
      if (error) return reject(error);
      for (let file of files) {
        fs.unlinkSync(path.resolve(tmpDir, file));
      }
      resolve(files);
    });
  });
}
