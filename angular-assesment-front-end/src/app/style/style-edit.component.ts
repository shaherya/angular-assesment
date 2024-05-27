import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {AlertService, SalesPhraseService, StyleService} from "../_services";
import {FormBuilder} from "@angular/forms";
import {Style} from "../_models";
import {StyleNewComponent} from "./style-new.component";

@Component({
  moduleId: module.id.toString(),
  templateUrl: './style-edit.component.html',
  styleUrls: ['./style.component.css']
})
export class StyleEditComponent extends StyleNewComponent implements OnInit {
  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected styleService: StyleService,
    protected alertService: AlertService,
    protected salesPhraseService: SalesPhraseService,
    protected formBuilder: FormBuilder
  ) {
    super(router, location, route, styleService, alertService, salesPhraseService, formBuilder);
    this.title = 'Edit Theme';
    this.isNew = false;
  }

  ngOnInit() {
    this.loading = true;
    super.ngOnInit();

    this.data$.subscribe(
      (style: Style) => {
        if (style) {
          this.style = style;
          this.styles = style.styles || {};
          this.form.patchValue({
            name: style.name,
            language: style.language,
            header_style: style.header_style,
            footer_style: style.footer_style,
            header_enhanced_mode: style.header_enhanced_mode,
            footer_enhanced_mode: style.footer_enhanced_mode,
            header_enhanced_content: style.header_enhanced_content,
            footer_enhanced_content: style.footer_enhanced_content,
          });

          if (style.variables) {
            this.variableFields.forEach((field, index) => {
              if (field.name in style.variables) {
                this.setVariableValue(index, style.variables[field.name]);
              }
            });
          }

          this.headerData.style = style.header_style;
          this.headerData.enhanced_content = style.header_enhanced_content;
          this.footerData.style = style.footer_style;
          this.footerData.enhanced_content = style.footer_enhanced_content;
          setTimeout(() => {
            this.loading = false;
          }, 1000)
        }
      },
      error => {
        this.handleError(error);
        this.loading = false;
      }
    );
  }

}
