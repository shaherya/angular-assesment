import { Component, OnInit, Input } from '@angular/core';
import { FormError } from './form';

@Component({
  selector: 'app-field-errors',
  templateUrl: 'field_errors.component.html'
})
export class FieldErrorsComponent implements OnInit {

  @Input() errors: FormError[];

  constructor() {}

  ngOnInit() {
  }

}
