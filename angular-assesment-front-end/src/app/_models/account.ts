import { Address, BaseModel } from './index';

export enum AccountStatus {
  Inactive = 0,
  Active = 1,
  Suspended = 2
}

export const AccountStatusLabels = [
  'Inactive',   // 0
  'Active',     // 1
  'Suspended',  // 2
  'Pending Approval',   // 3
];

export enum AccountBillingStatus {
  InSetup = 0,
  InTrial = 1,
  Billable = 2,
  NotBillable = 3
}

export const AccountBillingStatusLabels = [
  'In Setup',   // 0
  'In Trial',   // 1
  'Active',     // 2
  'Suspended'   // 3
];

export interface Account extends BaseModel {
  name: string;
  owner_id: string | number;
  default_address: Address;
  status: AccountStatus;
  billing_status: AccountBillingStatus;
  trial_start_date: string;
  billing_start_date: string;
  default_payment_source: string | number;
  domain: string;
}
