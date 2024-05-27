import { BaseModel } from './index';

export interface Address extends BaseModel {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
