import {BaseModel} from './index';

export enum CampaignStatus {
  Inactive = 0,
  Active = 1,
  Disabled = 2
}

export interface Campaign extends BaseModel {
  name: string;
  subdomain: string;
  active_domain: string;
  display_name: string;
  status: CampaignStatus;
}

export interface CampaignProductFormData {
  dimensions?: object,
  filtersData?: object,
  filters?: object,
  account?: Array<{ id: string | number, text: string }>,
  crm?: Array<{ id: string | number, text: string }>
}
