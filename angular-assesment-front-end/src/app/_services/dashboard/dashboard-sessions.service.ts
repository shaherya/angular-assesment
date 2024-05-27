import {Injectable} from "@angular/core";
import {DashboardService} from "./dashboard.service";
import {HttpClient} from "@angular/common/http";
import {AlertService} from "../alert.service";
import {BehaviorSubject} from "rxjs";
import {DashboardSessionsChartData} from "../../_models";
import {StorageService} from "../storage.service";
import {UserService} from "../user.service";

@Injectable()
export class DashboardSessionsService extends DashboardService {
  route = 'dashboard/session_results';
  protected data: BehaviorSubject<DashboardSessionsChartData> = new BehaviorSubject<DashboardSessionsChartData>({
    chartLegend: false,
    labels: ['Successful', 'Bypass', 'Dropoffs', 'Lifeline', 'Unmatched'],
    dataset: {
      backgroundColor: ['#163549', '#33bcd7', '#ffcc3e', '#e2e7ef', '#15c771', '#cc0000'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
      borderWidth: 3,
      data: [],
    },
    self_service_rate: [0, 0]
  })
  constructor(protected http: HttpClient, protected alertService: AlertService,
              protected storageService: StorageService, protected userService: UserService) {
    super(http, alertService, storageService, userService);
  }
}
