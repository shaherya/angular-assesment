import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {AlertService, SalesPhraseService} from '../_services';
import {CrudSavePopupComponent} from '../_directives';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  moduleId: module.id.toString(),
  selector: 'sales-phrase-form',
  templateUrl: './sales-phrase-edit.component.html'
})
export class SalesPhraseFormComponent extends CrudSavePopupComponent implements OnInit {
  constructor(protected router: Router,
              protected location: Location,
              protected route: ActivatedRoute,
              protected formBuilder: FormBuilder,
              protected salesPhraseService: SalesPhraseService,
              protected alertService: AlertService) {
    super(router, location, route, salesPhraseService, alertService);
    this.objectName = 'Sales Phrase';
  }

  ngOnInit() {
    this.setForm(this.formBuilder.group({
      text: [null, Validators.required]
    }));

    super.ngOnInit();
  }

}
