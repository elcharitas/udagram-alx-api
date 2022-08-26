import fs from "fs";
import path from "path";
import Jimp = require("jimp");

export const validateUrl = (url: string) =>
  url && /^htt(p|ps):\/\/.{3,}\..{3,8}/.test(url);

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
      const photo = await Jimp.read(inputURL);
      const filepath =
        "../../tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
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
  const tmpDir = path.resolve(__dirname, "../../tmp/");
  fs.readdir(tmpDir, (error, files) => {
    if (error) return;
    for (let file of files) {
      fs.unlinkSync(path.resolve(tmpDir, file));
    }
  });
}
