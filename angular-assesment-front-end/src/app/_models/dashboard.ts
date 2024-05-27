import {SessionSource, SessionResult, LifelineType, SessionActionResult, RevenueType} from './index';
import {ChartOptions, ChartType} from "chart.js";
import {Color} from "ng2-charts";

export const DailyDataThreshold = 21;

export interface TopData {
  session_date: string;
  source: SessionSource;
  num_sessions: number;
}

export interface SessionCount {
  source: SessionSource;
  result: SessionResult;
  num_sessions: number;
}

export interface Revenue {
  revenue_type: RevenueType;
  total_revenue: number;
}

export interface FaqResults {
  total_up_votes: number;
  total_down_votes: number;
}

export interface LifelineCount {
  lifeline_type: LifelineType;
  num_lifelines: number;
}

export interface SessionActionCount {
  result: SessionActionResult;
  session_date: string;
  num_sessions: number;
}

export interface Dashboard {
  top: TopData[];
  session_counts: SessionCount[];
  revenues: Revenue[];
  faq_results: FaqResults;
  lifelines: LifelineCount[];
  actions: SessionActionCount[];
}

export interface DashboardFilter {
  start_date: Date;
  end_date: Date;
  campaign_id?: string;
  includeTest?: boolean;
  includeHangups?: boolean;
  includeUnknowns?: boolean;
  timezone: string;
  account_id?: string
}

export interface DashboardChartDataset {
  backgroundColor: Array<string>,
  hoverBorderColor: Array<string>,
  data: Array<any>,
  borderWidth: number
}

export interface DashboardSessionsChartData {
  chartLegend: boolean,
  labels: Array<string>,
  dataset: DashboardChartDataset;
  self_service_rate: Array<number>;
}

export interface DashboardRevenuesChartData {
  title: string,
  labels: Array<string>,
  dataset: DashboardChartDataset,
  reportName: string
}

export interface BarChartData {
  label: string,
  data: Array<any>
}

export interface DashboardOrderOperationsChartData {
  title: string,
  datasets: BarChartData[],
  colors: Color[],
  labels: Array<string>,
  options: ChartOptions,
  plugins: Array<any>,
  legend: boolean,
  type: ChartType,
  reportName: string
}

export enum TimeData {
  DefaultFormat = 'Y-M-D HH:mm:ss',
  SessionListDateFormat = 'M/D LT',
  ReportsApiDateFormat = 'Y-MM-DD hh:mm:ss A',
  ReportsDisplayDateFormat = 'Y-M-D',
}
