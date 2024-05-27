import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {AlertService, SalesPhraseService} from '../_services';
import {SalesPhrase} from '../_models';
import {CrudListComponent} from '../_directives';
import {Observable} from "rxjs";
import {NgxSmartModalService} from 'ngx-smart-modal';

@Component({
  moduleId: module.id.toString(),
  templateUrl: './sales-phrase.component.html'
})
export class SalesPhraseComponent extends CrudListComponent implements OnInit {
  salesPhrases$ : Observable<SalesPhrase[]> = this.data$;
  selectedSalesPhrase: SalesPhrase;

  constructor(protected router: Router,
              protected location: Location,
              protected route: ActivatedRoute,
              protected salesPhraseService: SalesPhraseService,
              protected alertService: AlertService,
              protected modalService: NgxSmartModalService) {
    super(router, location, route, salesPhraseService, alertService);
    this.objectName = 'sales phrase';
    this.title = 'Sales Phrases';
  }

  ngOnInit() {
    super.ngOnInit();
  }

  create() {
    this.selectedSalesPhrase = null;
    this.openEditDialog();
  }

  edit(salesPhrase: SalesPhrase) {
    this.selectedSalesPhrase = salesPhrase;
    this.openEditDialog();
  }

  protected openEditDialog() {
    this.modalService.getModal('editDialog').open();
  }

  onSaveSalesPhrase(salesPhrase: SalesPhrase) {
    this.modalService.getModal('editDialog').close();
    this.queryData();
  }
}
