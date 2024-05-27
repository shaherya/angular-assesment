import { throwError as observableThrowError, Observable, of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService, StorageService } from '../_services';
import { User, AccountStatus } from '../_models';
import { map, catchError } from "rxjs/operators";

@Injectable()
export class AuthGuard implements CanActivate {
  currentUser: User;

  constructor(
    protected router: Router,
    protected userService: UserService,
    protected storageService: StorageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.storageService.get('authToken')) {
      return this.userService.getCurrent().pipe(
        map((user: User) => {
          //cache the user returned from the server and check their status
          this.currentUser = user;

          return this.checkCurrentUser(route, state);
        }),
        catchError(err => {
          //invalid token so force user to login again
          this.storageService.remove('authToken'); // token is invalid so delete it
          this.router.navigate(['/user', 'login'], {queryParams: {returnUrl: state.url}});
          return observableThrowError(false);
        })
      );
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/user', 'login'], {queryParams: {returnUrl: state.url}});
    return observableOf(false);
  }

  protected checkCurrentUser(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let isSubscribed = this.currentUser.is_staff ||
      (this.currentUser.account && (this.currentUser.account.status === AccountStatus.Active));

    if (route.data.adminOnly && !this.currentUser.is_staff) {
      this.router.navigate(['/']);
      return false;
    }

    if (state.url == '/user/subscribe') {
      if (isSubscribed) {
        //subscribed users can only edit the current subscription, they can't add a new one
        this.router.navigate(['/user', 'subscribe', 'edit']);
        return false;
      }
    }
    else {
      if (!isSubscribed) {
        //unsubscribed users must subscribe
        this.router.navigate(['/user', 'subscribe']);
        return false;
      }
    }

    return true;
  }
}
