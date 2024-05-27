import {CanDeactivateService} from "../_services";

export class CanDeactivateServiceWrapper {
  private static _canDeactivateService: CanDeactivateService;

  static getObject() {
    if (!CanDeactivateServiceWrapper._canDeactivateService) {
      CanDeactivateServiceWrapper._canDeactivateService = new CanDeactivateService();
    }

    return CanDeactivateServiceWrapper._canDeactivateService;
  }
}
