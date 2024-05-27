import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AlertService, AuthenticationService, RegionService, UserService} from '../_services/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Form} from "../_forms";
import {Location} from "@angular/common";

@Component({
  moduleId: module.id.toString(),
  templateUrl: 'password-reset.component.html'
})

export class PasswordResetComponent extends Form implements OnInit {
  form: FormGroup;
  loading = false;
  pageTitle = 'Password Reset'

  constructor(
    protected formBuilder: FormBuilder,
    protected router: Router,
    protected location: Location,
    protected userService: UserService,
    protected regionService: RegionService,
    protected alertService: AlertService,
    protected authenticationService: AuthenticationService) {
    super(alertService, router, location);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  submit() {
    this.loading = true;
    this.authenticationService.resetPassword(this.form.value.email)
      .subscribe(
        () => {
          this.alertService.success('We sent an email to ' + this.form.value.email + ' with a link to reset your password.  Please check your email and click the link to proceed.', true);
          this.router.navigate(['/password', 'reset', 'success']);
        },
        error => {
          let msg = 'Email is invalid.';

          switch (error.status) {
            case 500:
              msg = "Internal server error.";
              break;
          }

          this.alertService.error(msg);
          this.loading = false;
        });
  }
}
