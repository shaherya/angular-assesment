import {Injectable} from "@angular/core";
import {DashboardService} from "./dashboard.service";
import {BehaviorSubject} from "rxjs";
import {DashboardRevenuesChartData} from "../../_models";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AlertService} from "../alert.service";
import {StorageService} from "../storage.service";
import {UserService} from "../user.service";

@Injectable()
export class DashboardRevenuesService extends DashboardService {
  route = 'dashboard/revenues';
  lifeLineOptions: string[] = ['Phone', 'Email'];
  protected data: BehaviorSubject<DashboardRevenuesChartData[]> =
    new BehaviorSubject<DashboardRevenuesChartData[]>([]);
  constructor(protected http: HttpClient, protected alertService: AlertService,
              protected storageService: StorageService, protected userService: UserService) {
    super(http, alertService, storageService, userService);
    let initialData: DashboardRevenuesChartData[] = [
      {
        title: 'Total Revenue',
        labels: [],
        dataset: {
          backgroundColor: ["#33c0d9", "#ffcc3e"],
          hoverBorderColor: ["#fff", "#fff"],
          borderWidth: 3,
          data: []
        },
        reportName: 'total_revenues'
      },
      {
        title: 'Total Saves (0)',
        labels: [],
        dataset: {
          backgroundColor: ["#163549", "#33bcd7", "#e2e7ef"],
          hoverBorderColor: ["#fff", "#fff", "#fff"],
          borderWidth: 3,
          data: []
        },
        reportName: 'total_saved'
      },
      {
        title: 'Help Desk Inquires',
        labels: ['Successful', 'Unsuccessful'],
        dataset: {
          backgroundColor: ["#33bcd7", "#e2e7ef"],
          hoverBorderColor: ["#fff", "#fff"],
          borderWidth: 3,
          data: [50, 50]
        },
        reportName: null
      },
      {
        title: 'Lifelines',
        labels: [],
        dataset: {
          backgroundColor: ["#163549", "#33bcd7", "#e2e7ef"],
          hoverBorderColor: ["#fff", "#fff", "#fff"],
          borderWidth: 3,
          data: []
        },
        reportName: 'lifelines'
      }
    ]

    this.data.next(initialData);
  }

}
