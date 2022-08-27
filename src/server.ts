import express from "express";
import { filterImageFromURL, validateUrl, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express applic ation
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(express.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // filters an image from a public url
  app.get("/filteredimage", async (req, res) => {
    const { image_url } = req.query;
    const imgUrl = image_url?.toString();

    // 1. validate the image url
    if (!validateUrl(imgUrl)) res.send("Invalid URL");
    else {
      // 2. filter the image
      const imagePath = await filterImageFromURL(imgUrl);
      // 3. send the resulting file in response
      res.sendFile(imagePath, async () => {
        // 4. clear locally stored files
        await deleteLocalFiles();
      });
    }
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
