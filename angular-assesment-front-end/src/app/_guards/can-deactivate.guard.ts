import {Component, Injectable} from "@angular/core";
import {CanDeactivate} from "@angular/router";
import {CanDeactivateServiceWrapper} from "../_helpers/can-deactivate-service-wrapper";
import {CanDeactivateService} from "../_services";
import {NgxSmartModalService} from "ngx-smart-modal";

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<Component> {
  protected canDeactivateService: CanDeactivateService;
  constructor() {
    this.canDeactivateService = CanDeactivateServiceWrapper.getObject();
  }

  canDeactivate(component: Component) {
    if (this.canDeactivateService.canComponentDeactivate()) {
      if (!this.canDeactivateService.getSaveModalEventValue() || !this.canDeactivateService.getSaveModalEventValue().event) {
        this.canDeactivateService.setSaveModalEvent('', true);
        return false;
      } else {
        return true;
      }
    }
    return true;
  }
}
