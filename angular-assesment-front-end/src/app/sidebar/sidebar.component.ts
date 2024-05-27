import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {AccountService, AlertService, GuiService, UserService} from '../_services';
import {User, Account} from '../_models';
import {Form} from '../_forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent extends Form implements OnInit {
  user: User;

  public isExpanded: boolean = window.outerWidth > 1183;

  constructor(
    protected router: Router,
    protected location: Location,
    protected alertService: AlertService,
    private userService: UserService,
    protected guiService: GuiService,
    protected accountService: AccountService
  ) {
    super(alertService, router, location);
  }

  ngOnInit() {
    super.ngOnInit();
    this.guiService.setSidebarExpanded(this.isExpanded);

    this.userService.getCurrent()
      .subscribe((user: User) => {
        this.user = user;
      }, error => {
        this.alertService.error(error.message)
      })

    $(function(){
      var url = window.location.pathname;
      var activePage = url.substring(url.lastIndexOf('/')+1);
      $('.li-dashboard a').each(function(){
        var currentPage = this.href.substring(this.href.lastIndexOf('/')+1);
        if (activePage == currentPage) {
          $('.li-dashboard').addClass('activelink');
        }
      });

      $('.li-dashboard').click(function() {

        if ($(this).hasClass('activelink')) {
          $(this).addClass('activesss');
        }  else
        {
          $(this).addClass('activelink');

        }
      });

      $('ul li a[data-toggle="collapse"]').addClass('MainLink');

      $(' ul li.active ul.collapse').addClass('show');
      $(' ul li.active > a').attr('aria-expanded', 'true');


      $('.side-navbar ul > li > a[data-toggle="collapse"]').click(function() {

        if ($(this).hasClass('MainLink')){
          $('[data-toggle="collapse"]').attr('aria-expanded', 'false');
          $('.li-dashboard').removeClass('active');
          $('ul.collapse').removeClass('show');
          $('[aria-expanded="false"]').parent('li').removeClass('active');
          $('[aria-expanded="true"]').parent('li').addClass('active');

        }
        else
        {
          $('[data-toggle="collapse"]').removeClass('MainLink').attr('aria-expanded', 'false');

        }
      });

    })

    this.guiService.getGuiDataObs().subscribe(data => {
      if ('isSidebarExpanded' in data) {
        this.isExpanded = data.isSidebarExpanded;
      }
    })

    this.accountService.selectedAccount$.subscribe((account: Account) => {
      if (this.user) {
        this.user.account = account;
      }
    })
  }

  toggleExpand() {
    this.guiService.setSidebarExpanded(!this.isExpanded);
    let footer = $(".main-footer");
    if (footer.hasClass("footer-loggedin")) {
      footer.removeClass("footer-loggedin");
      footer.addClass("navbar-shrinked");
    } else {
      footer.addClass("footer-loggedin");
      footer.removeClass("navbar-shrinked");
    }

    if ($(window).outerWidth() < 1183) {
      $('.navbar-header .brand-small').show();
    }
  }

}
