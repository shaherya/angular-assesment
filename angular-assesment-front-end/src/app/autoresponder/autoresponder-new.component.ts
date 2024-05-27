import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { AlertService, AutoResponderService } from "../_services";
import { FormBuilder } from "@angular/forms";
import { CrudSaveComponent, ProjectableEditorComponent } from "../_directives";
import { AutoResponderFieldsComponent } from "./autoresponder-fields.component";
import { AutoResponder } from "../_models";

@Component({
  moduleId: module.id.toString(),
  templateUrl: "./autoresponder-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoresponderNewComponent
  extends CrudSaveComponent
  implements OnInit, AfterViewInit
{
  autoResponder: AutoResponder;
  @ViewChild(AutoResponderFieldsComponent, { static: false })
  autoResponderFields: AutoResponderFieldsComponent;

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected autoResponderService: AutoResponderService,
    protected formBuilder: FormBuilder,
    protected alertService: AlertService
  ) {
    super(router, location, route, autoResponderService, alertService);
    this.isNew = true;
    this.title = "Add a New SMS Autoresponder";
    this.objectName = "AutoResponder";
  }

  ngOnInit() {
    this.form = this.formBuilder.group({});
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.form.addControl("autoresponder", this.autoResponderFields.form);
  }
  protected getFormData() {
    return this.autoResponderFields.form.value;
  }
}
