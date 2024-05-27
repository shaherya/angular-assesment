import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { AlertService, AddressService } from "../_services";
import { FormBuilder } from "@angular/forms";
import { CrudSaveComponent } from "../_directives";
import { AddressFieldsComponent } from "./address-fields.component";
import { Address } from "../_models";

@Component({
  moduleId: module.id.toString(),
  templateUrl: "./address-edit.component.html",
})
export class AddressNewComponent
  extends CrudSaveComponent
  implements OnInit, AfterViewInit
{
  address: Address;
  @ViewChild(AddressFieldsComponent, { static: false })
  addressFields: AddressFieldsComponent;

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected addressService: AddressService,
    protected formBuilder: FormBuilder,
    protected alertService: AlertService
  ) {
    super(router, location, route, addressService, alertService);
    this.isNew = true;
    this.objectName = "Address";
  }

  ngOnInit() {
    this.form = this.formBuilder.group({});
    super.ngOnInit();
  }

  ngAfterViewInit() {
    setTimeout(
      () => this.form.addControl("address", this.addressFields.form),
      0
    );
  }

  protected getFormData() {
    return this.addressFields.form.value;
  }
}
