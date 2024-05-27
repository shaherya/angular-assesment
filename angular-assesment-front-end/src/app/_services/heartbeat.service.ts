import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import Timeout = NodeJS.Timeout;
import {environment} from "../../environments/environment";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class HeartbeatService {
  private heartbeat: Timeout = null

  constructor(protected http: HttpClient, protected authenticationService: AuthenticationService) {
  }

  beat() {
    if (!this.heartbeat) {
      let interval = (environment['heartBeatingInterval'] || 15) * 60 * 1000
      this.sendHeartBeat();
      let _this = this;
      this.heartbeat = setTimeout(() => {
        _this.heartbeat = null;
      }, interval)
    }
  }

  private sendHeartBeat() {
    // Send a heartbeat and because api returns 204, do nothing in subscribe. Any error will be handled appropriately
    // by the interceptor.
    this.http.post('auth/users/heartbeat/', {})
      .subscribe(_ => {
        this.authenticationService.updateAuthTokenExpiry();
      })
  }
}
