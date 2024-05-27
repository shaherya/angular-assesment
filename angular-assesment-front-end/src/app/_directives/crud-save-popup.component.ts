import {OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {AlertService, CrudService} from '../_services';
import {CrudSaveComponent} from './crud-save.component';

export abstract class CrudSavePopupComponent extends CrudSaveComponent implements OnInit, OnChanges {
  @Input('data') inputData: any;
  @Output('save') onSave: EventEmitter<any> = new EventEmitter<any>();
  @Output('cancel') onCancel: EventEmitter<any> = new EventEmitter<any>();
  formId = '';
  formIsReady = false;

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected crudService: CrudService,
    protected alertService: AlertService
  ) {
    super(router, location, route, crudService, alertService);
    this.isNew = true;
  }

  ngOnInit() {
    this.updateForm();
  }

  ngOnChanges(): void {
    this.updateForm();
  }

  protected updateForm() {
    this.formIsReady = false;

    if (this.form) {
      this.resetForm();

      if (this.inputData) {
        if (this.inputData.id) {
          this.id = this.inputData.id;
          this.formId = this.id.toString();
          this.isNew = false;
        }

        this.form.patchValue(this.inputData);
      }

      this.onInputDataChanged();

      if (!this.formId || !this.formId.length) {
        this.formId = 'random-' + Math.random().toString(36).substring(2);
      }

      // this is needed to force any tinymce editors to reload
      setTimeout(() => this.formIsReady = true, 0);
    }
  }

  protected onInputDataChanged() {

  }

  protected resetForm(scrollToTop: boolean = false) {
    super.resetForm(scrollToTop);
    this.isNew = true;
    this.id = null;
  }

  protected getFormData() {
    return this.form.value;
  }

  protected onSaveComplete(data) {
    this.resetForm();
    this.loading = false;
    this.onSave.emit(data);
  }

  cancel() {
    this.onCancel.emit();
  }
}
