import * as express from "express";
import * as interests from "./interests";

export const register = (app: express.Application) => {
  // First register the different routes
  interests.register(app);

  // Also here would be a good place for `/`, `/login`, `/register` ...
};
