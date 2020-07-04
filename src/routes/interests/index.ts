import * as express from "express";
import * as curl from "curl";

export class FacebookMarketingClient {
  private accessToken: string = process.env.FACEBOOK_TOKEN;
  private facebookApiUrl: string = process.env.FACEBOOK_URL;

  async getInterests() {
    return new Promise((accept, reject) => {
      const query = `${this.facebookApiUrl}?type=adTargetingCategory&class=interests&access_token=${this.accessToken}`;

      curl.get(query, "", (err: any, response: any, data: string) => {
        let interests: { data?: InterestData[]; error?: any };

        if (err) {
          reject(err);
        }

        interests = JSON.parse(data);
        if (interests.error) {
          reject(interests.error);
        }

        accept(interests.data);
      });
    });
  }

  async filterInterestsByStatus(interestsList: string, desiredStatus: string) {
    return new Promise((accept, reject) => {
      const query = `${this.facebookApiUrl}?type=targetingoptionstatus&targeting_option_list=[${interestsList}]&access_token=${this.accessToken}`;
      const interestsWithStatus: string[] = [];

      curl.get(query, "", (err: any, response: any, data: string) => {
        let parsedData: { error?: string; data: InterestStatus[] };

        if (err) {
          reject(err);
        }

        parsedData = JSON.parse(data);

        if (parsedData.error) {
          reject(parsedData.error);
        }

        parsedData.data.forEach((interest: InterestStatus) => {
          if (interest.current_status === desiredStatus) {
            interestsWithStatus.push(interest.id);
          }
        });

        accept(interestsWithStatus);
      });
    });
  }
}
export const register = (app: express.Application) => {
  const facebook = new FacebookMarketingClient();

  app.get(`/interests`, async (req: any, res) => {
    const idsList: string[] = [];
    const result: InterestData[] = [];
    let allInterests: InterestData[];

    await facebook
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

    await facebook
      .filterInterestsByStatus(idsList.toString(), `NORMAL`)
      .then((filteredIds: string[]) => {
        allInterests.forEach((interest: InterestData) => {
          if (filteredIds.includes(interest.id)) {
            result.push(interest);
          }
        });

        console.log(result.length);
        res.status(200);
        res.send(result);
      })
      .catch((err) => {
        res.sendStatus(500);
        throw err;
      });
  });

  app.get(`/interests/audience-size`, (req: any, res) => {
    console.log(`/interests/audience-size ${req.query.ids}`);
    res.sendStatus(200);
  });
};
