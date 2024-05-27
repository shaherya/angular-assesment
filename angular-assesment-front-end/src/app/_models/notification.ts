import {BaseModel, Account} from './index';

export enum EventStatus {
  IS_COMPLETED = 1,
  IN_PROGRESS = 2,
  HAS_ERROR = 3,
}

export enum NotificationType {
  CRM_SYNCING = 1,
  PATH_PUBLISHING = 2,
  GENERATING_REPORT = 3
}

export interface Notification extends BaseModel {
  type: NotificationType;
  event_name: string;
  account: Account;
  payload: object;
  message: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  event_status: EventStatus;
}
