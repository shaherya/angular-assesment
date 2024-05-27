import { BaseModel } from './index';

export enum CRMTypeId {
  Konnektive = 1,
}

export enum CRMTypeName {
  Konnektive = 'Konnektive',
}

export interface CRM extends BaseModel {
  name: string;
  display_name: string;
  type: number;
  credentials: {[key: string]: string;};
  config: {[key: string]: string;};
}

export interface CRMCampaign extends BaseModel {
  name: string;
  crm: string | number;
  crm_campaign_id: string;
  campaign: string | number;
}
