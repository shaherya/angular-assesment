import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertService, AuthenticationService} from '../_services';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Form} from '../_forms';
import {Location} from '@angular/common';


@Component({
  moduleId: module.id.toString(),
  templateUrl: 'login.component.html'
})

export class LoginComponent extends Form implements OnInit {
  form: FormGroup;
  loading = false;
  returnUrl: string;
  emailFocused: boolean = false;
  passwordFocused: boolean = false;

  constructor(
    protected location: Location,
    protected router: Router,
    protected alertService: AlertService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    super(alertService, router, location);
  }

  ngOnInit() {
    // reset login status
    console.log('login');

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.form = this.formBuilder.group({
      username: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]]
    });
  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  login() {
    this.submitted = true;

    if (this.form.valid) {
      this.loading = true;
      this.authenticationService.login(this.form.value.username, this.form.value.password)
        .subscribe(
          (user) => {
            if (user) {
              this.router.navigate([this.returnUrl]);
            } else {
              this.router.navigate(['/user/subscribe']);
            }
          },
          error => {
            let msg = 'Username and/or password is invalid.';

            switch (error.status) {
              case 401:
                msg = "You need to verify and activate your account before logging in.  " +
                  "We just sent you an email with an verification link.";
                break;

              case 403:
                msg = error.error.detail;
                break;

              case 423:
                msg = "Your account has been locked for too many failed login attempts.";
                break;

              case 500:
                msg = "Internal server error.";
                break;
            }

            this.alertService.error(msg);
            this.loading = false;
          });
    }
  }

  changeFocus(field: string, focus: boolean = true) {
    switch (field) {
      case 'email':
        this.emailFocused = focus;
        break;
      case 'password':
        this.passwordFocused = focus;
        break;
      default:
        break;
    }
  }
}
