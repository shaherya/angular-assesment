import {Component, Input, OnInit} from '@angular/core';

import { AlertService } from '../_services';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-alert',
  templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit {
  message: any;
  @Input('toastEnabled') toastEnabled: boolean = false;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getMessage().subscribe(message => { this.message = message; });
  }
}
