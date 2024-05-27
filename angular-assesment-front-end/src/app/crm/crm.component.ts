import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {AlertService, CRMService} from '../_services';
import {CrudPagedListComponent} from '../_directives';
import {CRM} from '../_models';
import {Observable} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  moduleId: module.id.toString(),
  templateUrl: './crm.component.html'
})
export class CRMComponent extends CrudPagedListComponent implements OnInit {
  crms$: Observable<CRM[]> = this.data$;

  private isSyncing: {} = {};

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected crmService: CRMService,
    protected alertService: AlertService
  ) {
    super(router, location, route, crmService, alertService);
    this.objectName = 'CRM interface';
    this.title = 'My CRMs';
  }

  ngOnInit() {
    super.ngOnInit();
  }

  isBusySyncing(crm: CRM) {
    return (crm.id in this.isSyncing) && this.isSyncing[crm.id]
  }

  sync(crm: CRM) {
    this.isSyncing[crm.id] = true;
    this.crmService.sync(crm.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          this.isSyncing[crm.id] = false;
        },
        error => {
          this.handleSubmitError(error);
          this.isSyncing[crm.id] = false;
        });
  }

}
