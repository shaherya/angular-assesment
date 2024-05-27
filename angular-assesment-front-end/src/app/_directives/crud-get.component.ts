import { OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlertService, CrudService } from '../_services';
import { Form } from '../_forms';
import { BehaviorSubject, of as observableOf } from "rxjs";
import { BaseModel } from "../_models";
import { mergeMap, takeUntil } from "rxjs/operators";

export abstract class CrudGetComponent extends Form implements OnInit, OnDestroy {
  protected _data$: BehaviorSubject<BaseModel> = new BehaviorSubject<BaseModel>(null);
  protected id: string | number;

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

    this.route.params.pipe(
      mergeMap(params => {
        this.id = params['id'];
        this.onRouteParams(params);
        let data = observableOf({});
        if (this.id) {
          data = this.crudService.get(this.id);
        }
        return data;
      }),
      takeUntil(this.destroy$)
    ).subscribe(
      (data: BaseModel) => this._data$.next(data),
      error => {
        this.handleError(error);
        this._data$.error(error);
      }
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._data$.unsubscribe();
  }

  protected onRouteParams(params: {}) {

  }

}
