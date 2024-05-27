import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from "@angular/common";
import {
  SessionSource,
  User,
  DashboardSessionsChartData,
  Pager,
  Campaign,
  DashboardFilter,
  SessionResult,
  DashboardState,
} from '../_models';
import {FormBuilder} from '@angular/forms';
import {
  AlertService, DashboardService, StorageService,
  DashboardSessionsService, DashboardPathChannelService
} from '../_services';
import {BaseChartDirective} from 'ng2-charts';
import {NgbDate, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {formatMoney, normalizeDateForQuery} from "../_helpers";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import * as moment from 'moment-timezone';

enum ResultChartLegend {
  Successful = 0,
  Bypass = 1,
  Dropoff = 2,
  Lifeline = 3,
  Error = 4
}

@Component({
  moduleId: module.id.toString(),
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css'],
  selector: 'app-home',
  providers: [DashboardService, DashboardSessionsService, DashboardPathChannelService]
})
export class HomeComponent implements OnInit, OnDestroy {
  selfServeCount = 0;
  supportCount = 0;
  sessionFilter = null;
  includeTestSessions = false;
  includeHangups = false;
  includeUnknowns = false;

  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;

  title = 'angular-datatables';
  currentUser: User;
  protected _destroy$: Subject<boolean> = new Subject<boolean>();

  chartLegend = false;
  chartOptions = {
    cutoutPercentage: 85,
    legend: {
      display: true,
      position: 'top',
      labels: {
        fontColor: "#2e3451",
        usePointStyle: true,
        fontSize: 13
      }
    },
    tooltips: {
      backgroundColor: 'rgba(47, 49, 66, 0.8)',
      titleFontSize: 13,
      titleFontColor: '#fff',
      caretSize: 0,
      cornerRadius: 4,
      xPadding: 10,
      displayColors: true,
      yPadding: 10
    }
  };
  gaugeOptions = {};

  chartData = {
    datasets1: [{
      backgroundColor: ["#33bcd7", "#e2e7ef"],
      hoverBorderColor: ["#fff", "#fff"],
      borderWidth: 3,
      data: [0, 100]
    }],
  };

  private sourceCounts = {};

  gaugeRotateAngle = 0;

  protected dashboardServicesMap = {};
  public sessionsChartData: DashboardSessionsChartData = null;
  public campaigns: Campaign[] = null;
  startDateDisplayString = '';
  endDateDisplayString = '';
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  filter = {};
  selectedFilters: DashboardFilter = null;
  public state: DashboardState = {};
  timezones: string[] = [];

  private gaugeMin = 0.25 * Math.PI;
  private gaugeMax = 1.75 * Math.PI;

  public loading: boolean = false;

  public updateSessionFilterFlag: boolean = true;

  public displaySessions: boolean = false;

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected alertService: AlertService,
    protected dashboardService: DashboardService,
    private storageService: StorageService,
    protected formBuilder: FormBuilder,
    protected dashboardPathChannelService: DashboardPathChannelService
  ) {
    this.title = 'Welcome to Solvpath';

    //gauge chart options
    this.gaugeOptions = Object.assign({}, this.chartOptions);
    this.gaugeOptions['circumference'] = 1.5 * Math.PI;
    this.gaugeOptions['rotation'] = 0.75 * Math.PI;
    this.gaugeRotateAngle = this.gaugeMin;

    this.dashboardServicesMap['dashboardPathChannelService'] = dashboardPathChannelService;
    this.timezones = moment.tz.names();
  }

  ngOnInit() {
    this.dashboardService.filters$
      .pipe(takeUntil(this._destroy$))
      .subscribe(change => {
        this.selectedFilters = change;
        this.state.startDate = change.start_date;
        this.state.endDate = change.end_date;
        this.startDateDisplayString = change.start_date.toLocaleDateString("en-US");
        this.endDateDisplayString = change.end_date.toLocaleDateString("en-US");
        this.startDate = {year: change.start_date.getFullYear(), month: change.start_date.getMonth() + 1,
        day: change.start_date.getDate()};
        this.endDate = {year: change.end_date.getFullYear(), month: change.end_date.getMonth() + 1,
          day: change.end_date.getDate()};
        Object.keys(this.dashboardServicesMap).forEach(key => {
          this.dashboardServicesMap[key].setFilter(change);
          this.dashboardServicesMap[key].getData();
          this.updateSessionFilterFlag = true;
        });
        //this.loading = true;
      });

    this.currentUser = this.storageService.get('currentUser');

    this.dashboardPathChannelService.data$
      .subscribe((pathChannels) => {
        this.sourceCounts = pathChannels;
        this.loading = false;
        this.updateSessionFilter();
      })
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  setDateRangeToToday() {
    this.setDates(new Date(), new Date());
  }

  setDateRangeToYesterday() {
    let date = new Date();

    date.setDate(date.getDate() - 1);

    this.setDates(date, date);
  }

  setDateRangeToLastNDays(numDays: number) {
    let date = new Date();

    date.setDate((date.getDate() + 1) - numDays);

    this.setDates(date, new Date());
  }

  setDateRangeToLastMonth() {
    let startDate = new Date();
    let endDate = new Date();

    //start date = 1st of last month
    startDate.setDate(1);
    startDate.setMonth(startDate.getMonth() - 1);

    //end date = last day of previous month
    endDate.setDate(0);

    this.setDates(startDate, endDate);
  }

  setDateRangeToCurrentMonth() {
    this.setDateRangeToNPastMonthsToDate(0);
  }

  setDateRangeToNPastMonthsToDate(numPastMonths: number) {
    let date = new Date();

    date.setDate(1);
    date.setMonth(date.getMonth() - numPastMonths);

    this.setDates(date, new Date());
  }

  setDateRangeToCurrentYear() {
    let date = new Date();

    date.setDate(1);
    date.setMonth(0);

    this.setDates(date, new Date());
  }

  setDateRangeToLastYear() {
    let startDate = new Date();
    let endDate = new Date();

    //start date = 1/1 of last year
    startDate.setMonth(0);
    startDate.setDate(1);
    startDate.setFullYear(startDate.getFullYear() - 1);

    //end date = 12/31 of last year
    endDate.setMonth(11);
    endDate.setDate(31);
    endDate.setFullYear(endDate.getFullYear() - 1);

    this.setDates(startDate, endDate);
  }

  parseStartDate(date: NgbDateStruct) {
    this.parseDate(true, date);
  }

  parseEndDate(date: NgbDateStruct) {
    this.parseDate(false, date);
  }

  private parseDate(isStartDate: boolean, dateStruct: NgbDateStruct) {
    const field = isStartDate ? 'start_date' : 'end_date';
    let patch = {};
    if (isStartDate) {
      patch['end_date'] = this.selectedFilters.end_date;
    } else {
      patch['start_date'] = this.selectedFilters.start_date
    }

    if (dateStruct) {
      let date = new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
      if (date) {
        patch[field] = date;
        if (isStartDate) {
          this.startDateDisplayString = date.toLocaleDateString();
        } else {
          this.endDateDisplayString = date.toLocaleDateString();
        }
        this.dashboardService.setFilter({...this.selectedFilters, ...{start_date: patch['start_date'],
            end_date: patch['end_date']}});
      }
    }
  }

  onStartDateSelect(date: NgbDate) {
    this.startDateDisplayString = date.month.toString() + '/' + date.day.toString() + '/' + date.year.toString();
  }

  onEndDateSelect(date: NgbDate) {
    this.endDateDisplayString = date.month.toString() + '/' + date.day.toString() + '/' + date.year.toString();
  }

  private setDates(startDate: Date, endDate: Date | null) {
    const sd: NgbDateStruct = {
      year: startDate.getFullYear(), month: startDate.getMonth() + 1, day: startDate.getDate()};
    const ed: NgbDateStruct | null = endDate ?
      {year: endDate.getFullYear(), month: endDate.getMonth() + 1, day: endDate.getDate()} : null;

    this.startDateDisplayString = sd ? sd.month.toString() + '/' + sd.day.toString() + '/' + sd.year.toString() : '';
    this.endDateDisplayString = ed ? ed.month.toString() + '/' + ed.day.toString() + '/' + ed.year.toString() : '';

    this.dashboardService.setFilter({...this.selectedFilters, ...{start_date: startDate, end_date: endDate}});
  }

  getPhoneSessionCount() {
    return this.sourceCounts[SessionSource.Phone] || 0;
  }

  getEmailSessionCount() {
    return this.sourceCounts[SessionSource.Email] || 0;
  }

  getWebSessionCount() {
    return this.sourceCounts[SessionSource.Web] || 0;
  }

  getSocialMediaSessionCount() {
    return this.sourceCounts[SessionSource.SocialMedia] || 0;
  }

  formatRevenue(amount: number) {
    return formatMoney(amount);
  }

  getPieDataPercent(data: number[], index: number) {
    let total = 0;

    data.forEach((value: number) => total += value);

    return total ? Math.round(100 * data[index] / total) : 0;
  }

  getSuccessfulSessionRate() {
    return this.getPieDataPercent(this.sessionsChartData.dataset.data, ResultChartLegend.Successful);
  }

  getSelfServeRate() {
    const self_service_data = this.sessionsChartData.self_service_rate;
    if (self_service_data[1] < 1) {
      this.gaugeRotateAngle = this.gaugeMin;
      this.chartData.datasets1[0].data = [0, 100];
      return 0;
    }

    const rate = (self_service_data[0] / self_service_data[1]);
    const percentage = Math.round(rate * 100);

    this.chartData.datasets1[0].data = [percentage, 100 - percentage];
    this.gaugeRotateAngle = this.gaugeMin + (rate * (this.gaugeMax - this.gaugeMin));

    return (rate * 100).toFixed(1);
  }

  private updateSessionFilter() {
    if (!this.updateSessionFilterFlag) {
      return;
    }
    let filter = {'started': true};

    if ('start_date' in this.selectedFilters) {
      filter['date_joined__gte'] = normalizeDateForQuery(this.selectedFilters.start_date,
        this.selectedFilters.timezone);
    }

    if ('end_date' in this.selectedFilters) {
      let date = this.selectedFilters.end_date;
      filter['date_joined__lt'] = normalizeDateForQuery(date, this.selectedFilters.timezone);
    }

    if (this.selectedFilters.campaign_id) {
      filter['campaign'] = this.selectedFilters.campaign_id;
    }

    if (!this.includeTestSessions) {
      filter['is_test'] = false;
    }

    if (this.selectedFilters.account_id) {
      filter['account_id'] = this.selectedFilters.account_id;
    }

    let result_filters: SessionResult[] = []

    if (!this.includeHangups) {
      result_filters.push(SessionResult.Abandoned)
    }


    if (!this.includeUnknowns) {
      result_filters.push(SessionResult.Unknown)
    }

    if (result_filters.length > 0) {
      filter['result__in!'] = result_filters.join(',')
    }

    this.sessionFilter = {...filter};
    this.updateSessionFilterFlag = false;
  }

  onCampaignChange(event) {
    this.dashboardService.setFilter({...this.selectedFilters, campaign_id: event.target.value});
    this.campaigns.forEach((campaign: Campaign) => {
      if (campaign.id.toString() === event.target.value.toString()) {
        this.state.campaign = campaign;
      }
    })
  }

  onAccountChange(event) {
    this.dashboardService.setFilter(({...this.selectedFilters, account_id: event.target.value, campaign_id: null}))
  }

  enableTestSessions(event) {
    this.includeTestSessions = event.target.checked;
    this.dashboardService.setFilter({...this.selectedFilters, ...{includeTest: this.includeTestSessions}});
    this.state.includeTest = this.includeTestSessions;
  }

  enableHangups(event) {
    this.includeHangups = event.target.checked;
    this.dashboardService.setFilter({...this.selectedFilters, ...{includeHangups: this.includeHangups}});
    this.state.includeHangups = this.includeHangups;
  }

  enableUnknowns(event) {
    this.includeUnknowns = event.target.checked;
    this.dashboardService.setFilter({...this.selectedFilters, ...{includeUnknowns: this.includeUnknowns}});
    this.state.includeUnknowns = this.includeUnknowns;
  }

  changeTimezone(event) {
    let timezone = event.target.value;
    this.storageService.set('timezone', timezone);
    this.dashboardService.setFilter({...this.selectedFilters, timezone});
  }

  updateSessionChartData(data) {
    this.sessionsChartData = data;
  }
}
