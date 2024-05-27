import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService, CanDeactivateService, GuiService, HeartbeatService, UserService} from './_services';
import '../assets/app.css';
import {NgxSmartModalService} from 'ngx-smart-modal';
import {CanDeactivateServiceWrapper} from './_helpers/can-deactivate-service-wrapper';
import {NavigationStart, Router} from '@angular/router';
import {User} from './_models';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements  OnInit, AfterViewChecked {
  title: string = '';
  showWidgetBackground = false;
  canDeactivateService: CanDeactivateService = CanDeactivateServiceWrapper.getObject();
  public isSidebarExpanded = false;
  currentUser: User;

  constructor(private translate: TranslateService, private authService: AuthenticationService,
              private modalService: NgxSmartModalService, private router: Router,
              protected guiService: GuiService, private userService: UserService,
              private heartBeatService: HeartbeatService, private cdr: ChangeDetectorRef) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.canDeactivateService.setRouteState(event.url);
      }
    });

    this.canDeactivateService.getSaveModalEventObs().subscribe(data => {
      if (data && data.open) {
        this.modalService.getModal('changesPopup').open();
      } else if (data && !data.open) {
        this.modalService.getModal('changesPopup').close();
      }
    });

    this.guiService.getGuiDataObs().subscribe(data => {
      if ('isSidebarExpanded' in data) {
        this.isSidebarExpanded = data.isSidebarExpanded;
      }

      if ('title' in data) {
        this.title = data.title;
      }
    });

    if (this.isLoggedIn()) {
      this.userService.getCurrent().subscribe(
        (user: User) => {
          this.currentUser = user;
        },
        error => {
        }
      );
    }

    document.addEventListener('mousedown', () => {
      if (this.currentUser) {
        this.heartBeatService.beat();
      }
    });

    document.addEventListener('keypress', () => {
      if (this.currentUser) {
        this.heartBeatService.beat();
      }
    });

  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  onActivate(component) {
    this.title = component.title;
    this.showWidgetBackground = !component.hideWidgetBackground && this.isLoggedIn()
    if (this.isLoggedIn()) {
      let footer = document.getElementById("footer");
      footer.classList.add("footer-loggedin");
    }
  }

  onDeactivate(component) {
    this.title = '';
    this.showWidgetBackground = false;
  }

  closeChangesModal() {
    this.canDeactivateService.setSaveModalEvent('', false);
  }

  saveChanges() {
    this.canDeactivateService.setSaveModalEvent('save', false);
  }

  discardChanges() {
    this.canDeactivateService.setSaveModalEvent('discard', false);
  }
}
