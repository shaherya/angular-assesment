import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { defer, EMPTY, Observable } from 'rxjs';
import { UserService } from './user.service';
import { StorageService } from "./storage.service";
import { User } from '../_models';
import { catchError, mergeMap } from "rxjs/operators";

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  login(username: string, password: string): Observable<User> {
    return this.http.post<any>('auth/token/create/', { username: username, password: password })
      .pipe(mergeMap(data => {
        // login successful if there's a jwt token in the response
        if (!data || !data.auth_token) {
          throw new HttpErrorResponse({status: 500, statusText: "Internal server error"});
        }

        // store jwt token in local storage to keep user logged in between page refreshes
        const token = data.auth_token;
        this.storageService.set('authToken', token);
        this.userService.clearCache();

        return this.userService.getCurrent();
      }));
  }

  logout() {
    // remove user from local storage to log user out
    const token = this.storageService.get('authToken');
    this.storageService.remove('authToken');
    this.userService.clearCache();
    this.http.post('auth/token/destroy/', {});
  }

  isLoggedIn(): boolean {
    const token = this.storageService.get('authToken');

    return !!token;
  }

  resetPassword(email: string) {
    return this.http.post<any>('auth/password/reset/', {email: email});
  }

  resetPasswordConfirm(uid: string, token: string, password: string) {
    return this.http.post('auth/password/reset/confirm/',
      {uid: uid, token: token, new_password: password});
  }

  inviteAccept(uid: string, token: string, firstName: string, lastName: string, password: string) {
    return this.http.post('auth/invite/accept/',
      {uid: uid, token: token, new_password: password, first_name: firstName, last_name: lastName});
  }

  updateAuthTokenExpiry() {
    const token = this.storageService.get('authToken');
    this.storageService.set('authToken', token);
  }

  resendActivationEmail(email: string) {
    return this.http.post<any>('auth/users/resend/', {email: email});
  }
}
