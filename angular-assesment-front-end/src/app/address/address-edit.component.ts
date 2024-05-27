import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { AlertService, AddressService } from "../_services";
import { FormBuilder } from "@angular/forms";
import { AddressNewComponent } from "./address-new.component";
import { Address } from "../_models";

@Component({
  moduleId: module.id.toString(),
  templateUrl: "./address-edit.component.html",
})
export class AddressEditComponent
  extends AddressNewComponent
  implements OnInit
{
  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected addressService: AddressService,
    protected formBuilder: FormBuilder,
    protected alertService: AlertService
  ) {
    super(router, location, route, addressService, formBuilder, alertService);
    this.isNew = false;
  }

  ngOnInit() {
    super.ngOnInit();
    this.data$.subscribe((address: Address) => {
      if (address) {
        this.address = address;
        setTimeout(() => this.addressFields.form.patchValue(address), 0);
      }
    });
  }
}
