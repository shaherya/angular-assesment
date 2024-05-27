import { OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlertService, PaginationService } from '../_services';
import { CrudListComponent } from './crud-list.component';
import { Pager } from '../_models';
import { config } from '../../config/config';
import { takeUntil } from "rxjs/operators";

export abstract class CrudPagedListComponent extends CrudListComponent implements OnInit {
  pageCount = 1;
  page = 1;
  pageSize = config.defaultPageSize;
  totalResultCount = 0;
  selectedRows: any = [];
  rowsPerPageOptions = [
    {value: 25, label: "25"},
    {value: 50, label: "50"},
    {value: 100, label: "100"},
    {value: 200, label: "200"}
  ];

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected paginationService: PaginationService,
    protected alertService: AlertService
  ) {
    super(router, location, route, paginationService, alertService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onPageChange(params) {
    this.page = params.page;
    this.pageSize = params.page_size;
    this.queryData();
  }

  ngxDataTableSetPage(pageInfo) {
    this.onPageChange({page: pageInfo.offset + 1, page_size: pageInfo.limit});
  }

  protected runInitialQuery() {
    //override to prevent base class from making initial request
  }

  protected resetPager() {
    this.page = 1;
  }

  protected setPagerData(data: Pager) {
    this.pageCount = data.num_pages;
    this.page = data.page;

    if (this.page === 1) {
      this.totalResultCount = data.count;
    }
  }

  protected onPagerData(data: Pager) {
    this._data$.next(data.results);
  }

  protected onPagerError(error) {
    this._data$.error(error);
  }

  protected queryData() {
    let params = Object.assign({}, this.getQueryFilter(), {page: this.page, page_size: this.pageSize});
    this.loading = true;
    this.paginationService.list(params)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (data: Pager) => {
          this.onPagerData(data);
          this.setPagerData(data);
          this.loading = false;
        },
        error => {
          this.handleError(error);
          this.onPagerError(error);
          this.loading = false;
        });
  }

  changeRowsPerPage(event) {
    const rowsPerpage = Number(event.target.value);
    this.pageSize = rowsPerpage;
    this.resetPager();
    this.queryData();
  }

}
