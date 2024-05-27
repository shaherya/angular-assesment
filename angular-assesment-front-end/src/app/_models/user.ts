import { Account, BaseModel } from './index';

export enum InviteStatus {
  None = 0,
  Pending = 1,
  Accepted = 2
}

export interface User extends BaseModel {
  account: Account;
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  test_phone: string;
  is_staff: boolean;
  is_active: boolean;
  invite_status: InviteStatus;
}

export interface ApiKey extends BaseModel {
  owner: string | number;
  key: string;
}
