import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { routing } from "./app.routing";

import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ColorPickerModule } from "ngx-color-picker";
import {
  AlertComponent,
  PagerComponent,
  HelpComponent,
  ProjectableEditorComponent,
  DualListSortableComponent,
} from "./_directives";
import { AuthGuard, AnonymousGuard } from "./_guards";
import { JwtInterceptor, TinymceConfig } from "./_helpers";
import {
  AlertService,
  AuthenticationService,
  UserService,
  RegionService,
  AddressService,
  CRMService,
  StyleService,
  CampaignProductService,
  CRMCampaignService,
  StorageService,
  ClipboardService,
  AccountService,
  SalesPhraseService,
  CanDeactivateService,
  GuiService,
  HeartbeatService,
  PersonalInfoService,
  AutoResponderService,
} from "./_services";
import { HomeComponent, SessionResultsComponent } from "./home";
import { LoginComponent } from "./login";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FieldErrorsComponent, FormErrorsComponent } from "./_forms";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {
  AddressComponent,
  AddressEditComponent,
  AddressNewComponent,
  AddressFieldsComponent,
} from "./address";
import { CRMComponent } from "./crm";
import {
  CampaignProductComponent,
  CampaignProductEditComponent,
} from "./campaign-product";
import { HeaderComponent } from "./header";
import { NgxUploaderModule } from "ngx-uploader";
import { TouchEventModule } from "ng2-events/lib/touch";
import { OutsideEventModule } from "ng2-events/lib/outside";
import { DndModule } from "@beyerleinf/ngx-dnd";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { StyleComponent, StyleNewComponent, StyleEditComponent } from "./style";
import { EditorModule } from "@tinymce/tinymce-angular";
import { SidebarComponent } from "./sidebar";
import {
  PasswordResetComponent,
  PasswordResetSuccessComponent,
  PasswordResetConfirmComponent,
} from "./password-reset";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { AngularDualListBoxModule } from "angular-dual-listbox";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { CollapsibleModule } from "angular2-collapsible";
import { ChartsModule, ThemeService } from "ng2-charts";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { NgxSmartModalModule } from "ngx-smart-modal";
import { BreadcrumbModule } from "angular-crumbs";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { CRMCampaignFormComponent } from "./crm-campaign";
import { SalesPhraseComponent, SalesPhraseFormComponent } from "./sales-phrase";
import { CanDeactivateGuard } from "./_guards/can-deactivate.guard";
import { NgSelectModule } from "@ng-select/ng-select";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { MatTreeModule } from "@angular/material/tree";
import { MatExpansionModule } from "@angular/material/expansion";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PersonalInfoComponent } from "./personal-info";
import { AutoresponderComponent } from "./autoresponder/autoresponder.component";
import { AutoResponderEditComponent } from "./autoresponder/autoresponder-edit.component";
import { AutoresponderNewComponent } from "./autoresponder/autoresponder-new.component";
import { AutoResponderFieldsComponent } from "./autoresponder/autoresponder-fields.component";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    BrowserModule,
    NgxDatatableModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgbModule,
    NgxUploaderModule,
    TouchEventModule,
    OutsideEventModule,
    DndModule,
    DragDropModule,
    BrowserAnimationsModule,
    EditorModule,
    NgxMaterialTimepickerModule,
    AngularDualListBoxModule,
    NgMultiSelectDropDownModule.forRoot(),
    CollapsibleModule,
    ChartsModule,
    MonacoEditorModule.forRoot(),
    NgxSmartModalModule.forRoot(),
    BreadcrumbModule,
    NgxDaterangepickerMd.forRoot(),
    ColorPickerModule,
    routing,
    MatTreeModule,
    MatExpansionModule,
  ],
  exports: [TouchEventModule, OutsideEventModule],
  declarations: [
    AppComponent,
    AlertComponent,
    PagerComponent,
    HelpComponent,
    ProjectableEditorComponent,
    FieldErrorsComponent,
    FormErrorsComponent,
    HomeComponent,
    LoginComponent,
    AddressComponent,
    AddressEditComponent,
    AddressNewComponent,
    AddressFieldsComponent,
    AutoresponderComponent,
    AutoResponderEditComponent,
    AutoresponderNewComponent,
    AutoResponderFieldsComponent,
    CRMComponent,
    CampaignProductComponent,
    CampaignProductEditComponent,
    HeaderComponent,
    StyleComponent,
    StyleNewComponent,
    StyleEditComponent,
    SidebarComponent,
    PasswordResetComponent,
    PasswordResetSuccessComponent,
    PasswordResetConfirmComponent,
    CampaignProductComponent,
    SessionResultsComponent,
    TermsAndConditionsComponent,
    PersonalInfoComponent,
    CRMCampaignFormComponent,
    SalesPhraseComponent,
    SalesPhraseFormComponent,
    DualListSortableComponent,
  ],
  providers: [
    AuthGuard,
    AnonymousGuard,
    StorageService,
    ClipboardService,
    AlertService,
    RegionService,
    AuthenticationService,
    UserService,
    AddressService,
    CRMService,
    StyleService,
    CampaignProductService,
    CRMCampaignService,
    AccountService,
    TinymceConfig,
    SalesPhraseService,
    CanDeactivateGuard,
    CanDeactivateService,
    GuiService,
    HeartbeatService,
    PersonalInfoService,
    ThemeService,
    AutoResponderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private tinymce: TinymceConfig) {
    this.tinymce.setDefaults(); //set defaults for tinymce editors
    this.tinymce.createPlugins(); //create custom plugins
  }
}
