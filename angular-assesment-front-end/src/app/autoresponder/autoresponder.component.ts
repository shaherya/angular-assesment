import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { AlertService, AutoResponderService } from "../_services";
import { CrudPagedListComponent } from "../_directives";
import { AutoResponder, User } from "../_models";
import { Observable } from "rxjs";

@Component({
  moduleId: module.id.toString(),
  templateUrl: "./autoresponder.component.html",
  selector: "Autoresponders",
})
export class AutoresponderComponent
  extends CrudPagedListComponent
  implements OnInit
{
  autoresponders$: Observable<AutoResponder[]> = this.data$;

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected autoresponderService: AutoResponderService,
    protected alertService: AlertService
  ) {
    super(router, location, route, autoresponderService, alertService);
    this.objectName = "autoresponder";
    this.title = "Autoresponders";
  }

  ngOnInit() {
    super.ngOnInit();
    console.log("AutoresponderComponent.ngOnInit()", this.data$);
  }
}
