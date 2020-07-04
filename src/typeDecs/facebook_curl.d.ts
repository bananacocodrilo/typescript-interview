declare module "curl";

type InterestData = Array<{
  id: string;
  name: string;
  audience_size: number;
  path: [string];
  description: string;
}>;

type AudienceSize = { totalAudienceSize: number };
