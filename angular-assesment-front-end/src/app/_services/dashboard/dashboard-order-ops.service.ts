import {Injectable} from "@angular/core";
import {DashboardService} from "./dashboard.service";
import {BehaviorSubject} from "rxjs";
import {DashboardOrderOperationsChartData} from "../../_models";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AlertService} from "../alert.service";
import {StorageService} from "../storage.service";
import {UserService} from "../user.service";

@Injectable()
export class DashboardOrderOpsService extends DashboardService {
  route = 'dashboard/order_operations';
  protected data: BehaviorSubject<DashboardOrderOperationsChartData[]> =
    new BehaviorSubject<DashboardOrderOperationsChartData[]>([]);
  constructor(protected http: HttpClient, protected alertService: AlertService,
              protected storageService: StorageService, protected userService: UserService) {
    super(http, alertService, storageService, userService);
    this.loadInitialData();
  }

  loadInitialData() {
    let initialData: DashboardOrderOperationsChartData[] = [
      {
        title: 'Cancellations/RMAs',
        datasets: [
          { data: [], label: 'Cancelled' },
          { data: [], label: 'Returned' },
          { data: [], label: 'Exchanged' },
          { data: [], label: 'Saved' },
        ],
        colors: [
          {backgroundColor: '#33c0d9'},
          {backgroundColor: '#ade4ef'},
          {backgroundColor: '#1c455e'},
          {backgroundColor: '#ffcc3e'}
        ],
        labels: [],
        options: {
          responsive: true,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                min: 0,
                suggestedMax: 10
              }
            }]
          }
        },
        plugins: [],
        legend: false,
        type: 'bar',
        reportName: 'cancellation_order'
      }
    ];
    this.data.next(initialData);
  }
}
