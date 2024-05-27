import { Component } from '@angular/core';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-help',
  templateUrl: 'help.component.html',
  styleUrls: ['help.component.css']
})

export class HelpComponent {
  isVisible = false;

  constructor() { }

  show(showFlag: boolean) {
    this.isVisible = showFlag;
  }
}
