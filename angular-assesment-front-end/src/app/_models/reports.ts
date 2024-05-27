import {BaseModel} from "./base-model";
import {Campaign} from "./campaign";

export interface ReportsUserConfiguration extends BaseModel{
  user: number | string;
  name: string;
  configuration: any;
  is_global: boolean;
}

export interface DashboardState {
  campaign?: Campaign;
  startDate?: Date;
  endDate?: Date;
  includeTest?: boolean;
  includeHangups?: boolean;
  includeUnknowns?: boolean;
  load_as_configuration?: boolean;
  config?: ReportsUserConfiguration
}
export enum ReportIntent {
  General = 0,
  Refund = 1
}

export let ReportIntentLabels = {};
ReportIntentLabels[ReportIntent.General] = 'General'
ReportIntentLabels[ReportIntent.Refund] = 'Refund'


export let ReportIntentServices  = {}
ReportIntentServices[ReportIntent.General] = 'defaultReportsService'
ReportIntentServices[ReportIntent.Refund] = 'refundReportService'

