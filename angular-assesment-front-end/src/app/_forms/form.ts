import {OnInit, OnDestroy} from '@angular/core';
import {FormGroup, AbstractControl, FormArray} from '@angular/forms';
import {AlertService} from '../_services';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Subject} from "rxjs";

export interface FormError {
  error: string;
  params: any;
}

export abstract class Form implements OnInit, OnDestroy {
  loading = false;
  title: string = '';
  hideWidgetBackground = false;
  form: FormGroup;
  submitted = false;

  protected _destroy$: Subject<boolean> = new Subject<boolean>();
  protected initialValue = {};

  constructor(
    protected alertService: AlertService,
    protected router: Router,
    protected location: Location
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  protected setTitle(title) {
    this.title = title;
  }

  protected setForm(form: FormGroup) {
    this.form = form;
    this.initialValue = form.value;
  }

  protected resetForm(scrollToTop: boolean = false) {
    this.submitted = false;
    this.loading = false;
    this.form.reset(this.initialValue);

    if (scrollToTop) {
      window.scroll(0, 0);
    }
  }

  goBack() {
    this.location.back();
  }

  reload() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  isFieldVisible(fieldName: string) {
    if (fieldName in this.form.controls) {
      return true;
    }

    return false;
  }

  toggleBooleanField(event, fieldname: string) {
    const control = this.getControl(fieldname);
    control.patchValue(!!event.target.checked);
  }

  isBooleanFieldChecked(fieldname: string) : boolean {
    const control = this.getControl(fieldname);
    return control ? control.value : false;
  }

  isFieldEqual(fieldname: string, value: any) {
    const control = this.getControl(fieldname);
    return control && (control.value.toString() === value.toString());
  }

  get destroy$() {
    return this._destroy$.asObservable();
  }

  public formErrors(): FormError[] {
    if (this.submitted && this.form.errors) {
      return this.getErrors(this.form);
    }
  }

  public fieldErrors(name: string): FormError[] {
    let control = this.findFieldControl(name);
    if (control && (control.touched || this.submitted) && control.errors) {
      return this.getErrors(control);
    }

    return undefined;
  }

  public isFieldValid(name: string): boolean {
    const control = this.getControl(name);
    return control && control.valid && (control.touched || control.dirty);
  }

  public isFieldInvalid(name: string): boolean {
    const control = this.getControl(name);
    return control && control.invalid && (control.touched || control.dirty);
  }

  public getControl(name: string) {
    let control: any = this.form;
    name.split(".").forEach(field => {
      control = control.get(field);
    });
    return control
  }

  public getControlValue(name: string) {
    const control = this.getControl(name);

    return control ? control.value : null;
  }

  public mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  public getAppropriateError(name: string, showOnSubmit: boolean = false): string {
    let errors = this.fieldErrors(name);
    let error = errors && errors.length? errors[0]: false;
    let forceDisplay = false;
    if (!error) {
      return "";
    }
    let errorMsg = error.error;
    switch (errorMsg) {
      case "minlength":
        let length = error.params.requiredLength;
        errorMsg = `must be at least ${length} characters`;
        break;
      case "maxlength":
        let maxLength = error.params.requiredLength;
        errorMsg = `must be at most ${maxLength} characters`
        break;
      case "email":
        errorMsg = "Invalid Email"
        break;
      case "mustMatch":
        errorMsg = "Field doesn't match"
        break;
      case "required":
        errorMsg = "This field is required"
        break;
      case "max":
        errorMsg = "Input is exceeding max limit"
        break;
      case "string":
        errorMsg = error.params.string
        forceDisplay = true
        break;
      default:
        break;
    }
    if (forceDisplay) {
      return errorMsg.charAt(0).toUpperCase() + errorMsg.substr(1).toLowerCase();
    }
    let control = this.getControl(name);
    if (showOnSubmit && !this.submitted) {
      return null
    } else if (showOnSubmit) {
      return errorMsg.charAt(0).toUpperCase() + errorMsg.substr(1).toLowerCase();
    }
    if (!control.dirty) {
      return null;
    }
    return errorMsg.charAt(0).toUpperCase() + errorMsg.substr(1).toLowerCase();
  }

  public getAppropriateFormError(name: string) {
    let error = this.getAppropriateError(name, true);
    if (!error) {
      return []
    }
    return [{error: 'string', params: {'string': error}}]
  }

  public resetFieldErrors(name: string): void {
    this.form.get(name).setErrors(null);
  }

  protected handleError(error: any, keepAfterNavigationChange: boolean = false) {
    if (error.status === 401) {
      this.router.navigate(['/user/login']);
    }
    else {
      let msg = error.statusText;

      if (error.status == 500) {
        console.log('error 500: ' + msg);
        msg = 'An internal server error occurred.';
      }
      if (error && error.status) {
        this.alertService.error("error " + error.status.toString() + ": " + msg, keepAfterNavigationChange);
      } else {
        this.alertService.error("error: " + msg, keepAfterNavigationChange);
      }
    }
  }

  protected handleSubmitError(error: any, keepAfterNavigationChange: boolean = false, showAlert: boolean = false) {
    if (error.status === 400) { //bad request
      if (Array.isArray(error)) {
        this.alertService.error(error[0], keepAfterNavigationChange);
        return;
      }
      const data = this.flattenObj(error.error);
      const fields = Object.keys(data || {});
      fields.forEach((field) => {
        const errors = this.fetchFieldErrors(data, field);
        let control: any = this.form;
        field.split(".").forEach(field => {
          control = control.get(field);
        });

        if (control) {
          control.setErrors(errors);
        }
        if (!control || showAlert) {
          this.alertService.error(errors.string, keepAfterNavigationChange);
        }
      });
    }
    else {
      this.handleError(error, keepAfterNavigationChange);
    }
  }

  protected getErrors(control: AbstractControl): FormError[] {
    return Object.keys(control.errors)
      .filter((error) => control.errors[error])
      .map((error) => {
        let params = control.errors[error];
        return {
          error: error,
          params: (error == 'string') ? {'string': params} : (params === true || params == {} ? null : params)
        };
      });
  }

  protected findFieldControl(field: string): AbstractControl {
    let control: AbstractControl;
    if ((field === 'base') || !this.form) {
      control = this.form;
    } else if (this.form.contains(field)) {
      control = this.form.get(field);
    } else if (field.match(/_id$/) && this.form.contains(field.substring(0, field.length - 3))) {
      control = this.form.get(field.substring(0, field.length - 3));
    } else if (field.indexOf('.') > 0) {
      let group = this.form;
      field.split('.').forEach((f) => {
        if (group.contains(f)) {
          control = group.get(f);
          if (control instanceof FormGroup) group = control;
        } else {
          control = group;
        }
      })
    } else {
      // Field is not defined in form but there is a validation error for it, set it globally
      control = this.form;
    }
    return control;
  }

  getFormGroup(groupName) {
    return this.form.controls[groupName] as FormGroup;
  }

  getFormArray(arrayName) {
    return this.form.get(arrayName) as FormArray;
  }

  public clearFormArray(arrayName: FormArray) {
    while (arrayName.length !== 0) {
      arrayName.removeAt(0)
    }
  }

  private fetchFieldErrors(data: any, field: string): any {
    const errors = {};
    if (!(field in data) || !data[field]) {
      return errors;
    }

    let field_errors = data[field];
    if (!Array.isArray(field_errors)) {
      field_errors = [field_errors]
    }
    field_errors.forEach((e) => {
      if (typeof(e) === 'string') {
        errors['string'] = e;
      }
      else {
        let name: string = e.error;
        delete e.error;
        errors[name] = e;
      }
    });
    return errors;
  }

  private isPlainObj(o: any): boolean {
    return o && o.constructor && o.constructor.prototype && o.constructor.prototype.hasOwnProperty("isPrototypeOf")
  }

  private flattenObj(obj: Object, keys=[]): Object {
    return Object.keys(obj).reduce((acc, key) => {
      return Object.assign(acc, this.isPlainObj(obj[key])
        ? this.flattenObj(obj[key], keys.concat(key))
        : {[keys.concat(key).join(".")]: obj[key]}
      )
    }, {})
  }

}
