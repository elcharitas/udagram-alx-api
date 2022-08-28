import express, { Request, Response } from "express";
import { filterImageFromURL, validateUrl, deleteLocalFiles } from "./util/util";

enum EStatus {
  Success = 200,
  Error = 422,
}

(async () => {
  // Init the Express applic ation
  const app = express();

  // Set the network port
  const port: number = Number(process.env.PORT) || 8082;

  // Use the body parser middleware for post requests
  app.use(express.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (_req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // filters an image from a public url
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url }: { image_url?: string } = req.query;
    const imgUrl: string | undefined = image_url?.toString();

    // 1. validate the image url
    if (!validateUrl(imgUrl))
      res.status(EStatus.Error).send("Invalid Image URL");
    else {
      // 2. filter the image and catch image filter errors
      const imagePath: string = await filterImageFromURL(imgUrl).catch(
        (err: Error) => {
          res.status(422).send(`Error filtering image: ${err.message}`);
          return null;
        }
      );
      if (!imagePath) return;
      // 3. send the resulting file in response
      res.status(EStatus.Success).sendFile(imagePath, async () => {
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
