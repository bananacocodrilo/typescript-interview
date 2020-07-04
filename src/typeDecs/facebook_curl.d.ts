declare module "curl";

type InterestStatus = { id: string; current_status: string };
type InterestListEntry = { id: string; name: string };
type AudienceSize = { totalAudienceSize: number };

type InterestData = {
  id: string;
  name: string;
  audience_size: number;
  path: [string];
  description: string;
};
