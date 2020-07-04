import * as express from "express";
import * as curl from "curl";

export class FacebookMarketingClient {
  private accessToken: string = process.env.FACEBOOK_TOKEN;
  private facebookApiUrl: string = process.env.FACEBOOK_URL;
  private interestsParams: string =
    "?type=adTargetingCategory&class=interests&access_token=";

  async getInterests() {
    return new Promise((accept, reject) => {
      curl.get(
        `${this.facebookApiUrl}${this.interestsParams}${this.accessToken}`,
        "",
        (err: any, response: any, data: string) => {
          let interests: { data: InterestData };
          if (err) {
            reject(err);
          }

          interests = JSON.parse(data);
          accept(interests.data);
        }
      );
    });
  }

  test() {
    return this.accessToken;
  }
}

export const register = (app: express.Application) => {
  const facebook = new FacebookMarketingClient();

  app.get(`/interests`, async (req: any, res) => {
    console.log(`/interests`);

    await facebook
      .getInterests()
      .then((data: InterestData) => {
        console.log(data);
        res.sendStatus(200);
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
