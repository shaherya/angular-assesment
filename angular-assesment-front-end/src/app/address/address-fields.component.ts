import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertService, RegionService } from '../_services';
import { FormBuilder, Validators } from '@angular/forms';
import { Region, Address } from '../_models';
import { Form } from '../_forms';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-address-fields',
  templateUrl: './address-fields.component.html'
})
export class AddressFieldsComponent extends Form implements OnInit {
  states: Region[];
  @Input('address') address: Address;

  constructor(
    private formBuilder: FormBuilder,
    protected router: Router,
    protected location: Location,
    protected alertService: AlertService,
    private regionService: RegionService
  ) {
    super(alertService, router, location);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [this.address ? this.address.id : null],
      address1: [this.address ? this.address.address1 : null, Validators.required],
      address2: [this.address ? this.address.address2 : null],
      city: [this.address ? this.address.city : null, Validators.required],
      state: [this.address ? this.address.state : null, Validators.required],
      zip: [this.address ? this.address.zip : null, Validators.required],
      country: [this.address ? this.address.country : 'us', Validators.required],
    });

    this.regionService.list('us')
      .subscribe(
        (states: Region[]) => {
          this.states = states;
        }
      )
  }
}
