import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { StorageService } from "../_services";
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private storageService: StorageService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let offset = (request.url[0] == '/') ? 1 : 0;
    let prefix = request.url.substr(offset, 7);

    if (prefix != "assets/" && request.url.indexOf('s3.amazonaws.com') == -1) {
      // add authorization header with jwt token if available
      const authToken = this.storageService.get('authToken');
      const profilerEnabled = this.storageService.get('profilerEnabled');
      let updatedReq = {url: `${environment.apiUrl}/${request.url}`};

      if (authToken || profilerEnabled) {
        updatedReq['setHeaders'] = {};

        if (authToken) {
          updatedReq['setHeaders']['Authorization'] = `Token ${authToken}`;
        }

        if (profilerEnabled) {
          updatedReq['setHeaders']['Profiler-Enabled'] = 'true';
        }
      }

      request = request.clone(updatedReq);
    }

    return next.handle(request).pipe(map((event: HttpEvent<any>) => {
      return event;
    }), catchError((err: any, caught) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          //invalid token so force user to login again
          this.storageService.remove('authToken'); // token is invalid so delete it
          this.router.navigate(['/user/login'], {queryParams: {returnUrl: request.url}});
        }
      }

      return throwError(err);
    }));
  }
}
