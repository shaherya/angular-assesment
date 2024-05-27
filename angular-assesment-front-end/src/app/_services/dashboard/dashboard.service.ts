import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {AlertService} from "../alert.service";
import {Injectable} from "@angular/core";
import * as moment from 'moment-timezone';
import {StorageService} from "../storage.service";
import {normalizeDateForQuery} from "../../_helpers/functions"; // Directly being imported from functions to handle circular dependency
import {UserService} from "../user.service";
import {User} from "../../_models";

@Injectable()
export class DashboardService {
  private _date = new Date();
  protected filter: BehaviorSubject<any> = new BehaviorSubject<any>({
    start_date: new Date(this._date.getFullYear(), this._date.getMonth(), this._date.getDate(), 0,
      0, 0),
    end_date: new Date(this._date.getFullYear(), this._date.getMonth(), this._date.getDate(), 23,
      59, 59),
    includeTest: false,
    timezone: moment.tz.guess(),
    includeHangups: false,
    includeUnknowns: false
  });

  protected data: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  protected route: string = '';

  constructor(protected http: HttpClient, protected alertService: AlertService,
              protected storageService: StorageService, protected userService: UserService) {
    let currentTimezone = storageService.get('timezone');
    if (!currentTimezone) {
      currentTimezone = moment.tz.guess();
    }

    this.userService.getCurrent()
      .subscribe((user: User) => {
        if (user && user.account) {
          this.setFilter({...this.filter.value, account_id: user.account.id})
        }
      })

    let start_date = new Date();
    start_date.setDate(start_date.getDate() - 8);
    let end_date = new Date();
    end_date.setDate(end_date.getDate() - 1);
    start_date = new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate(), 0,0, 0);
    end_date = new Date(end_date.getFullYear(), end_date.getMonth(), end_date.getDate(), 23,59, 59);
    this.setFilter({...this.filter.value, timezone: currentTimezone, start_date, end_date});
  }

  getQueryParams() {
    let filters = this.filter.getValue();
    let startDate = filters.start_date;
    let endDate = filters.end_date;
    let query_params = {};

    query_params['start_date'] = normalizeDateForQuery(startDate, filters.timezone);
    query_params['end_date'] = normalizeDateForQuery(endDate, filters.timezone);

    if (filters.campaign_id) {
      query_params['campaign_id'] = filters.campaign_id;
    }

    if (filters.account_id) {
      query_params['account_id'] = filters.account_id;
    }

    query_params['include_tests'] = filters.includeTest;
    query_params['include_hangups'] = filters.includeHangups;
    query_params['include_unknowns'] = filters.includeUnknowns;
    return new HttpParams({fromObject: query_params});
  }

  getData() {
  }

  get data$() {
    return this.data.asObservable();
  }

  get filters$() {
    return this.filter.asObservable();
  }

  setFilter(data) {
    if ('start_date' in data) {
      data['start_date'] = new Date(data['start_date'].getFullYear(), data['start_date'].getMonth(),
        data['start_date'].getDate(), 0, 0, 0);
    }

    if ('end_date' in data) {
      data['end_date'] = new Date(data['end_date'].getFullYear(), data['end_date'].getMonth(),
        data['end_date'].getDate(), 23, 59, 59);
    }
    this.filter.next(data);
  }
}
