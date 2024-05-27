import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService } from '../_services';
import { FormBuilder, Validators } from '@angular/forms';
import { Form } from '../_forms'
import { Location } from "@angular/common";

@Component({
  moduleId: module.id.toString(),
  templateUrl: 'password-reset-confirm.component.html'
})

export class PasswordResetConfirmComponent extends Form implements OnInit {
  loading = false;

  private uid;
  private token;

  constructor(
    private formBuilder: FormBuilder,
    protected router: Router,
    protected location: Location,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    protected alertService: AlertService
  ) {
    super(alertService, router, location);
  }

  ngOnInit() {
    this.uid = this.route.snapshot.queryParams['uid'];
    this.token = this.route.snapshot.queryParams['token'];
    this.form = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(8)]],
      cpassword: [null, [Validators.required, Validators.minLength(8)]]
    });

  }

  resetPasswordConfirm() {
    this.loading = true;
    this.authenticationService.resetPasswordConfirm(this.uid, this.token, this.form.value.password)
      .subscribe(
        () => {
          this.alertService.success('Your password has been changed.  You may now login and use your account.',
            true);
          this.router.navigate(['/user/login']);
        },
        error => {
          this.alertService.error("error " + error.status.toString() + ": " + error.statusText)
        });
  }
}
