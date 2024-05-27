import {Injectable} from "@angular/core";
import {DashboardService} from "./dashboard.service";
import {BehaviorSubject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AlertService} from "../alert.service";
import {SessionSource} from "../../_models";
import {StorageService} from "../storage.service";
import {UserService} from "../user.service";

@Injectable()
export class DashboardPathChannelService extends DashboardService {
  route = 'dashboard/path_channels';
  protected data: BehaviorSubject<Object> = new BehaviorSubject<Object>({});
  constructor(protected http: HttpClient, protected alertService: AlertService,
              protected storageService: StorageService, protected userService: UserService) {
    super(http, alertService, storageService, userService);

  }
}
