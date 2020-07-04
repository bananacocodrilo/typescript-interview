declare module "curl";

type InterestData = {
  id: string;
  name: string;
  audience_size: number;
  path: [string];
  description: string;
};

type AudienceSize = { totalAudienceSize: number };

type InterestStatus = { id: string; current_status: string };
