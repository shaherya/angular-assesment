import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {AlertService, CRMCampaignService} from '../_services';
import {CrudSavePopupComponent} from '../_directives';
import {FormBuilder} from '@angular/forms';
import {CRMCampaign, Campaign} from '../_models';

@Component({
  moduleId: module.id.toString(),
  selector: 'crm-campaign-form',
  templateUrl: './crm-campaign-form.component.html'
})
export class CRMCampaignFormComponent extends CrudSavePopupComponent implements OnInit {
  campaigns: Campaign[] = [];
  crmCampaign: CRMCampaign;

  constructor(protected router: Router,
              protected location: Location,
              protected route: ActivatedRoute,
              protected formBuilder: FormBuilder,
              protected crmCampaignService: CRMCampaignService,
              protected alertService: AlertService
  ) {
    super(router, location, route, crmCampaignService, alertService);
    this.objectName = 'CRM Campaign';
  }

  ngOnInit() {
    this.setForm(this.formBuilder.group({
    }));

    super.ngOnInit();
  }

  protected onInputDataChanged() {
    this.crmCampaign = this.inputData;

    if (this.crmCampaign) {

    }
  }

}
