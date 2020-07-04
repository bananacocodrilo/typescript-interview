import dotenv from "dotenv";
import { FacebookMarketingClient } from "../src/classes/facebookMarketingClient";

describe("Facebook client basic functionality", () => {
  dotenv.config();
  const facebookClient = new FacebookMarketingClient();
  let ids: any[] = [];

  it("Should return a list of interests", async () => {
    await facebookClient.getInterests().then((data: any[]) => {
      expect(data.length).toBeGreaterThan(0);
      expect(Object.keys(data[0])).toContain("id");

      data.forEach((val) => {
        ids.push(val.id);
      });
    });
  });

  it("Should return a shorter or equal list than the one given", async () => {
    await facebookClient
      .filterInterestsByStatus(ids, "NORMAL")
      .then((data: any[]) => {
        expect(data.length).toBeLessThanOrEqual(ids.length);
      });
  });
});

describe("Facebook client errors", () => {
  it("Should reject given an invalid token", () => {
    dotenv.config();
    process.env.FACEBOOK_TOKEN = "InvalidToken";
    const facebookClient = new FacebookMarketingClient();
    let ids: any[] = [];

    return facebookClient.getInterests().catch((e) => expect(e).toBeTruthy());
  });

  it("Should reject given an invalid api url", () => {
    dotenv.config();
    process.env.FACEBOOK_URL = "https://graph.facebook.com/v2.11/search";

    const facebookClient = new FacebookMarketingClient();
    let ids: any[] = [];

    return facebookClient.getInterests().catch((e) => expect(e).toBeTruthy());
  });
});
