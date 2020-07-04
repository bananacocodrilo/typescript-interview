import * as express from "express";

export const register = (app: express.Application) => {
  app.get(`/interests`, async (req: any, res) => {
    console.log(`/interests`);
    res.sendStatus(200);
  });

  app.get(`/interests/audience-size`, (req: any, res) => {
    console.log(`/interests/audience-size ${req.query.ids}`);
    res.sendStatus(200);
  });
};
