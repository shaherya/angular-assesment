import {OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {AlertService, CrudService} from '../_services';
import {Form} from '../_forms';
import {BehaviorSubject, combineLatest} from "rxjs";
import {takeUntil, map} from "rxjs/operators";

export abstract class CrudListComponent extends Form implements OnInit, OnDestroy {
  defaultFilterSettings = {
    singleSelection: false,
    allowSearchFilter: true,
    enableCheckAll: false
  };
  objectName = 'object';

  protected _data$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  protected filter: {} = {};
  protected ordering: string[] = [];
  protected requeryOnFilterChanges = true;
  protected orderingFieldsMap = {};

  private initialized = false;

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected crudService: CrudService,
    protected alertService: AlertService
  ) {
    super(alertService, router, location);
  }

  get data$() {
    return this._data$.asObservable();
  }

  ngOnInit() {
    super.ngOnInit();

    this.filter = JSON.parse(sessionStorage.getItem(this.objectName + '_filter')) || {};
    this.ordering = JSON.parse(sessionStorage.getItem(this.objectName + '_ordering')) || [];
    this.initializeFilter();
    this.runInitialQuery();
    this.setupFilterEvents();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._data$.unsubscribe();
    sessionStorage.setItem(this.objectName + '_filter', JSON.stringify(this.filter));
    sessionStorage.setItem(this.objectName + '_ordering', JSON.stringify(this.ordering));
  }

  delete(id) {
    if(window.confirm('Are you sure you want to delete this ' + this.objectName + '?')) {
      this.loading = true;

      this.crudService.delete(id)
        .pipe(takeUntil(this._destroy$))
        .subscribe(
          result => {
            this.alertService.success('Deleted ' + this.objectName + '.');
            this._data$.next(this._data$.getValue().filter(data => data.id != id));
            this.onDelete(id);
            this.loading = false;
          },
          error => {
            this.handleSubmitError(error);
            this.loading = false;
          });
    }
  }

  onNgxDataTableSort(event) {
    const ordering = [];
    event.sorts.forEach(sort => {
      const prefix = (sort.dir === 'desc') ? '-' : '';
      let prop = sort.prop;
      if (prop in this.orderingFieldsMap) {
        prop = this.orderingFieldsMap[prop];
      }
      ordering.push(prefix + prop);
    });

    this.orderBy(ordering);
  }

  getNgxDataTableSorts() {
    let sorts = [];

    let propKeys: Array<string> = Object.keys(this.orderingFieldsMap);
    let propValues: Array<string> = Object.values(this.orderingFieldsMap);

    this.ordering.forEach(value => {
      let dir = 'asc';

      if (value[0] === '-') {
        dir = 'desc';
        value = value.substr(1);
      }

      if (propValues.indexOf(value) > -1) {
        value = propKeys[propValues.indexOf(value)];
      }

      sorts.push({prop: value, dir: dir});
    });

    return sorts;
  }

  protected onDelete(id) {

  }

  protected initializeFilter() {
    this.filter = Object.assign(this.filter, this.route.snapshot.params, this.route.snapshot.queryParams);
    const params$ = combineLatest([this.route.params, this.route.queryParams]);
    const results$ = params$.pipe(map(results => ({...results[0], ...results[1]})));

    results$.subscribe(
      params => {
        const reQuery = this.initialized; // re-run the query if we've already initialized and params changed

        if (!this.initialized) {
          params = Object.assign({}, params, this.filter); //merge in initial filter for the 1st query
          this.initialized = true;
        }

        this.filter = params;
        this.onRouteParams(params);

        if (this.form) {
          this.form.patchValue(params);
        }

        if (reQuery) {
          this.queryData();
        }
      },
      error => {
        this.handleError(error);
      });
  }

  protected onRouteParams(params: {}) {

  }

  protected resetPager() {

  }

  protected setupFilterEvents() {
    if (this.form) {
      for (let field in this.form.controls) {
        this.form.get(field).valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
          if (val) {
            this.addFilter(field, val);
          }
          else {
            this.removeFilter(field);
          }

          this.onFilterFieldChange(field, val);
        });
      }
    }
  }

  protected onFilterFieldChange(field: string, value) {

  }

  protected addFilter(key: string, value: any) {
    if (!(key in this.filter) || (this.filter[key] !== value)) {
      this.filter[key] = value;

      if (this.requeryOnFilterChanges) {
        this.resetPager();
        this.queryData();
      }
    }
  }

  protected removeFilter(key: string) {
    if (key in this.filter) {
      delete this.filter[key];

      if (this.requeryOnFilterChanges) {
        this.resetPager();
        this.queryData();
      }
    }
  }

  protected clearFilter() {
    this.setFilter({});
  }

  protected setFilter(filter: {}) {
    this.filter = Object.assign({}, filter);

    if (this.requeryOnFilterChanges) {
      this.resetPager();
      this.queryData();
    }
  }

  protected runInitialQuery() {
    this.queryData();
  }

  protected getQueryFilter() {
    let filter = {};

    Object.keys(this.filter).forEach(key => {
      let value = this.filter[key];

      if (Array.isArray(value)) {
        if (value.length) {
          let filterValues = [];

          value.forEach(val => {
            filterValues.push((val && (typeof val === 'object') && ('id' in val)) ? val['id'] : val);
          });

          if (value.length > 1) {
            filter[key + '__in'] = filterValues.join(',');
          } else {
            filter[key] = filterValues[0];
          }
        }
      } else {
        filter[key] = (value && (typeof value === 'object') && ('id' in value)) ? value['id'] : value;
      }
    });

    if (this.ordering && this.ordering.length) {
      filter['ordering'] = this.ordering.join(',').replace(/\./g, '__');
    }

    return filter;
  }

  protected queryData() {
    this.loading = true;
    this.crudService.list(this.getQueryFilter())
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        data => {
          this._data$.next(data)
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.handleError(error);
          this._data$.error(error);
        });
  }

  protected orderBy(ordering: string[]) {
    this.ordering = ordering.slice(0);
    this.resetPager();
    this.queryData();
  }

}
