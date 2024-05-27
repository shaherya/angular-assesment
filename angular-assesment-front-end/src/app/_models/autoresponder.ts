import { BaseModel } from './index';

export enum AutoResponderType {
  SMS = 1,
}

export interface Response extends BaseModel {
  delay: number;
  message: string;
  message_after_hours: string;
}

export interface AutoResponder extends BaseModel {
  name: string;
  type: AutoResponderType;
  responses: Response[];
}
