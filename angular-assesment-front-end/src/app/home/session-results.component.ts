import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import {DashboardSessionsService, StorageService} from "../_services";
import {Subject} from "rxjs";
import {DashboardFilter, DashboardSessionsChartData} from "../_models";
import {takeUntil} from "rxjs/operators";

enum ResultChartLegend {
  Successful = 0,
  Bypass = 1,
  Dropoff = 2,
  Lifeline = 3,
  Error = 4
}

@Component({
  moduleId: module.id.toString(),
  templateUrl: 'session-results.component.html',
  styleUrls: ['./home.component.css'],
  selector: 'session-results',
  providers: [DashboardSessionsService],
})
export class SessionResultsComponent implements OnInit, OnChanges, OnDestroy {
  protected _destroy$: Subject<boolean> = new Subject<boolean>();
  public sessionsChartData: DashboardSessionsChartData = null;
  public loading: boolean = false;
  @Input('selectedFilters') selectedFilters: DashboardFilter = null;
  @Output('updateSessionChartData') updateSessionChartData: EventEmitter<any> = new EventEmitter<any>();
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

  constructor(protected sessionService: DashboardSessionsService,
              protected storageService: StorageService) {
  }

  ngOnInit() {
    this.loading = true;
    if (this.selectedFilters) {
      this.sessionService.setFilter(this.selectedFilters);
      this.sessionService.getData();
    }
    this.sessionService.data$.pipe(takeUntil(this._destroy$)).subscribe(data => {
      this.loading = false;
      this.sessionsChartData = data;
      this.updateSessionChartData.emit(data);
    });
  }

  ngOnChanges() {
    this.loading = true;
    this.sessionService.setFilter(this.selectedFilters);
    this.sessionService.getData();
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  getPieDataPercent(data: number[], index: number) {
    let total = 0;

    data.forEach((value: number) => total += value);

    return total ? Math.round(100 * data[index] / total) : 0;
  }

  getSuccessfulSessionRate() {
    return this.getPieDataPercent(this.sessionsChartData.dataset.data, ResultChartLegend.Successful);
  }
}
