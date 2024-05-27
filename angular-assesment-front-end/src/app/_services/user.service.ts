import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of as observableOf} from 'rxjs';
import {User} from '../_models';
import {map} from 'rxjs/operators'
import {StorageService} from "./storage.service";
import {PaginationService} from "./pagination.service";

@Injectable()
export class UserService extends PaginationService {
  constructor(
    protected http: HttpClient,
    private storageService: StorageService
  ) {
    super(http, 'account_users');
  }

  getCurrent(): Observable<User> {
    let user = this.storageService.get('currentUser');

    if (user) {
      //get the cached user and check their status
      return observableOf(user);
    }
    else {
      //user not cached, so get it from the server
      return this.http.get('auth/me/').pipe(map((user: User) => {
        this.storageService.set('currentUser', user); //cache the user returned from the server
        return user;
      }));
    }
  }

  create(user: User) {
    return this.http.post('auth/users/create/', user);
  }

  verify(uid: string, token: string) {
    return this.http.post('auth/users/activate/', {'uid': uid, 'token': token});
  }

  clearCache() {
    this.storageService.remove('currentUser');
  }

}
