import * as curl from "curl";

export class FacebookMarketingClient {
  private accessToken: string = process.env.FACEBOOK_TOKEN;
  private facebookApiUrl: string = process.env.FACEBOOK_URL;

  /**
   * @brief Returns an array of InterestData with all the interests available
   */
  async getInterests() {
    return new Promise((accept, reject) => {
      const query = `${this.facebookApiUrl}?type=adTargetingCategory&class=interests&access_token=${this.accessToken}`;

      curl.get(query, "", (err: any, response: any, data: string) => {
        let interests: { data?: InterestData[]; error?: any };

        if (err) {
          reject(err);
          return;
        }

        interests = JSON.parse(data);
        if (interests.error) {
          reject(interests.error);
          return;
        }

        accept(interests.data);
      });
    });
  }

  /**
   * @brief Given an array of interests ids and a targeting option status, filters which of the ids are in that status
   * @param interestsList Array of interests ids
   * @param desiredStatus String with a targeting option status
   */
  async filterInterestsByStatus(
    interestsList: string[],
    desiredStatus: string
  ) {
    return new Promise((accept, reject) => {
      const query = `${
        this.facebookApiUrl
      }?type=targetingoptionstatus&targeting_option_list=[${interestsList.toString()}]&access_token=${
        this.accessToken
      }`;

      const idsWithStatus: string[] = [];

      curl.get(query, "", (err: any, response: any, data: string) => {
        let parsedData: { error?: string; data: InterestStatus[] };

        if (err) {
          reject(err);
          return;
        }

        parsedData = JSON.parse(data);

        if (parsedData.error) {
          reject(parsedData.error);
          return;
        }

        parsedData.data.forEach((interest: InterestStatus) => {
          if (interest.current_status === desiredStatus) {
            idsWithStatus.push(interest.id);
          }
        });

        accept(idsWithStatus);
      });
    });
  }
}
