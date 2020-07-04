import * as express from "express";
import { FacebookMarketingClient } from "../../classes/facebookMarketingClient";

export const register = (app: express.Application) => {
  const facebookClient = new FacebookMarketingClient();

  app.get(`/interests`, async (req: any, res) => {
    const idsList: string[] = [];
    const result: InterestListEntry[] = [];
    let allInterests: InterestData[];

    // First get all the interests
    await facebookClient
      .getInterests()
      .then((data: InterestData[]) => {
        // Make a copy and a list of ids
        allInterests = [...data];
        data.forEach((interest: InterestData) => {
          idsList.push(interest.id);
        });
      })
      .then(() => facebookClient.filterInterestsByStatus(idsList, `NORMAL`)) // Filter the list of ids by status=NORMAL
      .then((filteredIds: string[]) => {
        // Create the list of interests in NORMAL status with the expected result format
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
        return;
      });
  });

  app.get(`/interests/audience-size`, async (req: any, res) => {
    const result: AudienceSize = { totalAudienceSize: 0 };
    let idsList: string[] = [];

    // Parameter validation
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
      // This time we filter the ids first since we already have a list of ids
      .filterInterestsByStatus(idsList, `NORMAL`)
      .then((filteredIds: string[]) => {
        idsList = [...filteredIds];
      })
      .then(() => facebookClient.getInterests()) // Get all the interests
      .then((data: InterestData[]) => {
        data.forEach((interest) => {
          // finally add all the audiences in the filtered list
          if (idsList.includes(interest.id)) {
            result.totalAudienceSize += interest.audience_size;
          }
        });

        res.status(200);
        res.send(result);
      })
      .catch((err) => {
        res.sendStatus(500);
        return;
      });
  });
};
