import { ValidationErrors, Validators, AbstractControl } from '@angular/forms';

export class CustomValidators {
  static email(control: AbstractControl): ValidationErrors | null {
    const emailError = Validators.email(control);
    if (control.value && emailError) {
      return {'email': {}};
    }

    return null;
  }
}
