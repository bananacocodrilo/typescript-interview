import dotenv from "dotenv";
import express from "express";

import * as routes from "./routes";

// Load .env file
dotenv.config();
// Basic env check
if (
  !process.env.FACEBOOK_TOKEN ||
  !process.env.FACEBOOK_URL ||
  !process.env.SERVER_PORT
) {
  throw new Error(
    `Missing config parameter. Verify the required env vars with the .env.sample file`
  );
}

const port = process.env.SERVER_PORT;
const app = express();

app.use(express.json());
routes.register(app);

app.listen(port, () => {
  console.info(`server started at http://localhost:${port}`);
});
