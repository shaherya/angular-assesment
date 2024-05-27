import {OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {Location} from '@angular/common';
import {AlertService, CanDeactivateService, CrudService} from '../_services';
import {CrudGetComponent} from './crud-get.component';
import {takeUntil} from "rxjs/operators";
import {CanDeactivateServiceWrapper} from "../_helpers/can-deactivate-service-wrapper";
import {Observable} from "rxjs";

export abstract class CrudSaveComponent extends CrudGetComponent implements OnInit, OnDestroy {
  protected objectName = 'Object';
  protected isNew = false;
  protected isPartial = false;
  protected isBulkUpdate = false;
  protected showSuccessMessage = true;
  protected returnUrl = null;
  protected canDeactivateService: CanDeactivateService = CanDeactivateServiceWrapper.getObject();

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected crudService: CrudService,
    protected alertService: AlertService
  ) {
    super(router, location, route, crudService, alertService);
  }

  ngOnInit() {
    if (!this.title) {
      this.setTitle(this.isNew ? 'Add a New ' + this.objectName : 'Change Your ' + this.objectName);
    }

    this.returnUrl = this.route.snapshot.params['returnUrl'];

    if (this.isNew) {
      this.route.params.pipe(takeUntil(this._destroy$))
        .subscribe(
          params => {
            this.onRouteParams(params);
          },
          error => {
            this.handleError(error);
          });
    }
    else {
      super.ngOnInit();
    }
    window.addEventListener('beforeunload', (event) => {
      this.unLoadEvent(event);
    });
    this.form.valueChanges.subscribe(form => {
      this.canDeactivateService.setFormDirty(this.form.dirty);
    });
    this.canDeactivateService.getSaveModalEventObs().subscribe(data => {
      if (data && data.event === 'save') {
        this.returnUrl = this.canDeactivateService.getCurrentRouteTo();
        this.onSubmit();
      } else if (data && data.event === 'discard') {
        this.canDeactivateService.setFormDirty(false); //discard changes
        this.router.navigate([this.canDeactivateService.getCurrentRouteTo()]);
      }
    });
    this.canDeactivateService.setSaveModalEvent('', false);
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', (event) => {this.unLoadEvent(event)});
    super.ngOnDestroy();
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      this.loading = true;

      if (this.isNew) {
        this.crudService.create(this.getFormData())
          .subscribe(
            data => {
              if ('id' in data) {
                this.id = data['id'];
              }

              if (this.showSuccessMessage) {
                this.alertService.success('Added new ' + this.objectName.toLowerCase() + '.', true);
              }

              this.canDeactivateService.setFormDirty(false);
              this.onSaveComplete(data);
            },
            error => {
              this.handleSubmitError(error);
              this.loading = false;
            });
      }
      else {
        let operation: Observable<Object>;

        if (this.isBulkUpdate) {
          operation = this.crudService.bulkUpdate(this.getFormData())
        } else if (this.isPartial) {
          operation = this.crudService.patch(this.id, this.getFormData())
        } else {
          operation = this.crudService.update(this.id, this.getFormData())
        }

        operation.subscribe(
          data => {
            if (this.showSuccessMessage) {
              this.alertService.success('Updated ' + this.objectName.toLowerCase() + '.', true);
            }

            this.canDeactivateService.setFormDirty(false);
            this.onSaveComplete(data);
          },
          error => {
            this.handleSubmitError(error);
            this.loading = false;
          });
      }
    }
  }

  protected getFormData() {
    return this.form.value;
  }

  protected onSaveComplete(data) {
    if (this.returnUrl) {
      this.router.navigate([this.returnUrl]);
    }
    else {
      this.goBack();
    }

    this.loading = false;
  }

  protected navigate(commands: any[], extras?: NavigationExtras) {
    if (this.returnUrl) {
      this.router.navigate([this.returnUrl]);
    }
    else {
      this.router.navigate(commands, extras);
    }
  }

  goBack() {
    if (this.returnUrl) {
      this.router.navigate([this.returnUrl]);
    }
    else {
      super.goBack();
    }
  }

  reload() {
    if (this.returnUrl) {
      this.router.navigate([this.returnUrl]);
    }
    else {
      this.loading = false;
      super.reload();
    }
  }

  unLoadEvent(event) {
    if (this.canDeactivateService.canComponentDeactivate()) {
      event.preventDefault();
      event.returnValue = true;
    }
  }
}
