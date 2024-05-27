import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PaginationService} from "./pagination.service";
import {BehaviorSubject} from "rxjs";
import {UserService} from "./user.service";
import {Account} from '../_models';

@Injectable()
export class AccountService extends PaginationService {
  private selectedAccount: BehaviorSubject<Account> = new BehaviorSubject<Account>(null);

  constructor(protected http: HttpClient, protected userService: UserService) {
    super(http, 'accounts');
    this.userService.getCurrent()
      .subscribe(user => {
        if (user.account) {
          this.setUserAccount(user.account);
        }
      })
  }

  setUserAccount(account: Account) {
    this.selectedAccount.next(account);
  }

  get selectedAccount$() {
    return this.selectedAccount.asObservable();
  }

}
