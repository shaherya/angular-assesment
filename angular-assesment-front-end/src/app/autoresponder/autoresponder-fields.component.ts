import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { AlertService } from "../_services";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AutoResponder } from "../_models";
import { Form } from "../_forms";

@Component({
  moduleId: module.id.toString(),
  selector: "app-autoresponder-fields",
  templateUrl: "./autoresponder-fields.component.html",
  styleUrls: ["./autoresponder-fields.css"],
})
export class AutoResponderFieldsComponent extends Form implements OnInit {
  @Input("autoresponder") autoresponder: AutoResponder;

  constructor(
    private formBuilder: FormBuilder,
    protected router: Router,
    protected location: Location,
    protected alertService: AlertService
  ) {
    super(alertService, router, location);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      type: [1],
      responses: this.formBuilder.array([]),
    });
  }

  get responses() {
    return this.form.get("responses") as FormArray;
  }

  createResponse(): FormGroup {
    return this.formBuilder.group({
      id: [""],
      days: [0],
      hours: [0],
      minutes: [0],
      message: ["", Validators.required],
      showAfterHourControls: [false],
      message_after_hours: [""],
    });
  }

  addResponse(): void {
    this.responses.push(this.createResponse());
  }

  deleteResponse(index: number): void {
    this.responses.removeAt(index);
  }
  ngOnChanges(changes) {
    if (changes.autoresponder && changes.autoresponder.currentValue) {
      this.patchForm(this.autoresponder);
    }
  }
  private patchForm(autoresponder: AutoResponder) {
    this.form.patchValue({
      name: autoresponder.name,
      type: autoresponder.type,
    });

    // this.responses.clear();
    autoresponder.responses.forEach((response) => {
      const responseFormGroup = this.createResponse();
      responseFormGroup.patchValue(response);
      this.responses.push(responseFormGroup);
    });
  }
}
