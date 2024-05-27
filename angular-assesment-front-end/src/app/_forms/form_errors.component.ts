import { Component, OnInit, Input } from '@angular/core';
import { FormError } from './form';

@Component({
  selector: 'app-form-errors',
  templateUrl: 'form_errors.component.html'
})
export class FormErrorsComponent implements OnInit {

  @Input() errors: FormError[];

  constructor() {}

  ngOnInit() {
  }

}
