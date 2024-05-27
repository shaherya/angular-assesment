import {Injectable} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable()
export class AlertService {
  private subject = new BehaviorSubject<any>(null);
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next(null);
        }
      }
    });
  }

  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message });
    let _this = this;
    setTimeout(() => {
      _this.subject.next(null);
    }, 3000)
  }

  error(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'error', text: message });
    let _this = this;
    setTimeout(() => {
      _this.subject.next(null);
    }, 3000)
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
