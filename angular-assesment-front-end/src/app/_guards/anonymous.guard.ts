import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services';

@Injectable()
export class AnonymousGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      //logged in, so go home
      this.router.navigate(['/']);
      return false;
    }

    //not logged in, so continue to page that's allowed for anonymous users only
    return true;
  }
}
