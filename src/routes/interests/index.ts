import * as express from "express";
import { FacebookMarketingClient } from "../../classes/facebookMarketingClient";

export const register = (app: express.Application) => {
  const facebookClient = new FacebookMarketingClient();

  app.get(`/interests`, async (req: any, res) => {
    const idsList: string[] = [];
    const result: InterestListEntry[] = [];
    let allInterests: InterestData[];

    await facebookClient
      .getInterests()
      .then((data: InterestData[]) => {
        allInterests = [...data];
        data.forEach((interest: InterestData) => {
          idsList.push(interest.id);
        });
      })
      .catch((err) => {
        res.sendStatus(500);
        throw err;
      });

    await facebookClient
      .filterInterestsByStatus(idsList, `NORMAL`)
      .then((filteredIds: string[]) => {
        allInterests.forEach((interest: InterestData) => {
          if (filteredIds.includes(interest.id)) {
            result.push({ id: interest.id, name: interest.name });
          }
        });

        res.status(200);
        res.send(result);
      })
      .catch((err) => {
        res.sendStatus(500);
        throw err;
      });
  });

  app.get(`/interests/audience-size`, async (req: any, res) => {
    const result: AudienceSize = { totalAudienceSize: 0 };
    let idsList: string[] = [];

    try {
      idsList = req.query.ids.split(",");
    } catch (e) {
      console.warn(`[${Date.now()}] Received invalid request `);
    }

    if (!idsList || !idsList.length || !idsList[0].length) {
      res.status(400);
      res.send(
        "Invalid request. `ids` parameter must provide a list of ids separated by ','."
      );
      return;
    }

    await facebookClient
      .filterInterestsByStatus(idsList, `NORMAL`)
      .then((filteredIds: string[]) => {
        idsList = [...filteredIds];
      })
      .catch((err) => {
        res.sendStatus(500);
        throw err;
      });

    await facebookClient
      .getInterests()
      .then((data: InterestData[]) => {
        data.forEach((interest) => {
          if (idsList.includes(interest.id)) {
            result.totalAudienceSize += interest.audience_size;
          }
        });

        res.status(200);
        res.send(result);
      })
      .catch((err) => {
        res.sendStatus(500);
        throw err;
      });
  });
};
