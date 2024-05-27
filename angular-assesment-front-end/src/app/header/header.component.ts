import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  UserService,
  AuthenticationService,
  AlertService,
  GuiService,
  AccountService,
} from "../_services";
import { User, Account } from "../_models";
import { Form } from "../_forms";
import { Location } from "@angular/common";
import { takeUntil } from "rxjs/operators";

@Component({
  moduleId: module.id.toString(),
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent extends Form implements OnInit {
  currentUser: User;
  isSidebarExpanded: boolean = false;
  selectedAccount: Account;

  constructor(
    protected router: Router,
    protected location: Location,
    protected alertService: AlertService,
    private authService: AuthenticationService,
    private userService: UserService,
    private guiService: GuiService,
    protected accountService: AccountService
  ) {
    super(alertService, router, location);
  }

  ngOnInit() {
    this.userService
      .getCurrent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (user: User) => {
          this.currentUser = user;
        },
        (error) => {
          this.handleError(error);
        }
      );

    this.guiService.getGuiDataObs().subscribe((data) => {
      if ("isSidebarExpanded" in data) {
        this.isSidebarExpanded = data.isSidebarExpanded;
      }

      if ("title" in data) {
        this.title = data.title;
      }
    });
    this.accountService.selectedAccount$.subscribe((account: Account) => {
      this.selectedAccount = account;
      if (this.currentUser) {
        this.currentUser.account = account;
      }
    });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  gotoAccountPage(page) {
    const path = ["/" + page];
    this.router.navigate(path);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/user", "login"]);
  }

  toggleSidebar() {
    this.guiService.setSidebarExpanded(!this.isSidebarExpanded);
  }
}
