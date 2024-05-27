import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { AlertService, AutoResponderService } from "../_services";
import { FormBuilder } from "@angular/forms";
import { AutoresponderNewComponent } from "./autoresponder-new.component";
import { AutoResponder } from "../_models";

@Component({
  moduleId: module.id.toString(),
  templateUrl: "./autoresponder-edit.component.html",
})
export class AutoResponderEditComponent
  extends AutoresponderNewComponent
  implements OnInit
{
  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected autoResponderService: AutoResponderService,
    protected formBuilder: FormBuilder,
    protected alertService: AlertService
  ) {
    super(
      router,
      location,
      route,
      autoResponderService,
      formBuilder,
      alertService
    );
    this.title = "Change Your SMS Autoresponder";
    this.isNew = false;
  }

  ngOnInit() {
    super.ngOnInit();
    this.data$.subscribe((autoResponder: AutoResponder) => {
      if (autoResponder) {
        this.autoResponder = autoResponder;
        const resposder = {
          ...autoResponder,
          responses: autoResponder.responses.map((e) => {
            return {
              message: e.message,
            };
          }),
        };
        this.autoResponderFields.form.patchValue(resposder);
      }
    });
  }
}
