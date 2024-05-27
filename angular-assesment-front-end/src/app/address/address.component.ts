import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlertService, UserService, AddressService } from '../_services';
import { CrudPagedListComponent } from '../_directives';
import { Address, User } from '../_models';
import { Observable } from "rxjs";

@Component({
  moduleId: module.id.toString(),
  templateUrl: './address.component.html',
  selector: 'Addresses'
})
export class AddressComponent extends CrudPagedListComponent implements OnInit {
  addresses$: Observable<Address[]> = this.data$;
  defaultAddress: Address;

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    private userService: UserService,
    protected addressService: AddressService,
    protected alertService: AlertService
  ) {
    super(router, location, route, addressService, alertService);
    this.objectName = 'address';
    this.title = 'My Addresses';
  }

  ngOnInit() {
    super.ngOnInit();

    this.userService.getCurrent()
      .subscribe(
        (user: User) => {
          this.defaultAddress = user.account.default_address;
        },
        error => {
          this.handleError(error);
        }
      )
  }

}
