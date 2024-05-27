import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { AlertService, StyleService } from "../_services";
import { CrudPagedListComponent } from "../_directives";
import { Style } from "../_models";
import { Observable } from "rxjs";

@Component({
  moduleId: module.id.toString(),
  templateUrl: "./style.component.html",
  styleUrls: ["./style.component.css"],
})
export class StyleComponent extends CrudPagedListComponent implements OnInit {
  styles$: Observable<Style[]> = this.data$;
  loading = false;

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected styleService: StyleService,
    protected alertService: AlertService
  ) {
    super(router, location, route, styleService, alertService);
    this.objectName = "theme";
    this.title = "Themes";
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
