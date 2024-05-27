import {Component, OnInit} from '@angular/core';
import {CrudSaveComponent} from "../_directives";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {AlertService, SalesPhraseService, StyleService} from "../_services";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  FunnelStepMobileIconButtonType,
  getFunnelStepMobileIconButtonTypeOptions,
  SalesPhrase,
  Style,
  StyleLanguage,
  StyleMediaType,
  StyleVariable
} from '../_models';
import {takeUntil} from "rxjs/operators";

@Component({
  moduleId: module.id.toString(),
  templateUrl: './style-edit.component.html'
})
export class StyleNewComponent extends CrudSaveComponent implements OnInit {
  style: Style;
  salesPhrases: SalesPhrase[];
  styles = null;

  headerData = {
    style: '',
    enhanced_content: '',
  };
  footerData = {
    style: '',
    enhanced_content: '',
  };

  variableFields = [
    {label: 'Main Theme Color', name: 'theme_color', type: 'color'},
    {label: 'Button Hover Color', name: 'button_hover_color', type: 'color'},
    {label: 'Button Active Color', name: 'button_active_color', type: 'color'},
    {label: 'Button Shadow Color', name: 'button_shadow_color', type: 'color'},
    {label: 'Selection Background Color', name: 'selection_background_color', type: 'color'},
    {label: 'Action Button Color', name: 'action_color', type: 'color'},
    {label: 'Desktop Logo Height', name: 'desktop_logo_height', type: 'text'},
    {label: 'Desktop Logo Top Margin', name: 'desktop_logo_top_margin', type: 'text', default: 0},
    {label: 'Mobile Logo Height', name: 'mobile_logo_height', type: 'text'},
    {label: 'Mobile Logo Top Margin', name: 'mobile_logo_top_margin', type: 'text', default: 0},
    {label: 'Mobile Logo Bottom Margin', name: 'mobile_logo_bottom_margin', type: 'text', default: 0},
    {label: 'Mobile Icon Button Type', name: 'mobile_icon_button_type', type: 'select', default: FunnelStepMobileIconButtonType.TILE,  options: getFunnelStepMobileIconButtonTypeOptions()},
  ];

  previewData = null;

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected styleService: StyleService,
    protected alertService: AlertService,
    protected salesPhraseService: SalesPhraseService,
    protected formBuilder: FormBuilder
  ) {
    super(router, location, route, styleService, alertService);
    this.title = 'Create Theme';
    this.objectName = 'theme';
    this.isNew = true;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      language: [StyleLanguage.CSS, Validators.required],
      header_enhanced_mode: [false],
      footer_enhanced_mode: [false],
      header_enhanced_content: [''],
      footer_enhanced_content: [''],
      header_style: [''],
      footer_style: [''],
      variables: this.formBuilder.array([])
    });

    this.variableFields.forEach(variable => {
      this.addVariable(variable.name, ('default' in variable) ? variable.default : null);
    });
    super.ngOnInit();

    this.salesPhraseService.list()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (salesPhrases: SalesPhrase[]) => {
          this.salesPhrases = salesPhrases;
        },
        error => {
          this.handleError(error);
        }
      );

    if (this.isNew) {
      this.styles = {};
    }
  }

  getVariableValue(index: number) {
    const fields = this.form.get('variables') as FormArray;
    const control = fields.at(index).get('value');

    return control.value;
  }

  setVariableValue(index: number, value: any) {
    const fields = this.form.get('variables') as FormArray;
    const control = fields.at(index);

    control.patchValue({value: value});
  }

  private addVariable(name: string = null, value: any = null) {
    let fields = this.form.get('variables') as FormArray;

    fields.push(this.createVariable({
      name: name,
      value: value
    } as StyleVariable));
  }

  private createVariable(field: StyleVariable) : FormGroup {
    return this.formBuilder.group({
      name: [field.name],
      value: [field.value]
    });
  }

  getSalesPhraseStyle(phrase: SalesPhrase, style: string) {
    const selector = '.sales-phrase.' + phrase.slug;

    return this.getStyle(StyleMediaType.All, selector, style);
  }

  setSalesPhraseStyle(phrase: SalesPhrase, style: string, value: string) {
    const selector = '.sales-phrase.' + phrase.slug;

    this.setStyle(StyleMediaType.All, selector, style, value);
  }

  protected getStyle(mediaType: StyleMediaType, selector: string, style: string) {
    if (mediaType in this.styles) {
      if (selector in this.styles[mediaType]) {
        return this.styles[mediaType][selector][style] || null;
      }
    }

    return null;
  }

  protected setStyle(mediaType: StyleMediaType, selector: string, style: string, value: string) {
    if (!(mediaType in this.styles)) {
      this.styles[mediaType] = {};
    }

    if (!(selector in this.styles[mediaType])) {
      this.styles[mediaType][selector] = {};
    }

    this.styles[mediaType][selector][style] = value.trim();
  }

  protected getFormData() {
    let variables = {};

    //convert variables array to object
    if (this.form.value.variables && this.form.value.variables.length) {
      this.form.value.variables.forEach((field: StyleVariable) => {
        if (field.value !== null && field.value !== '') {
          variables[field.name] = field.value;
        }
      })
    }

    return Object.assign({}, this.form.value, {variables: variables}, {styles: this.styles});
  }

}
