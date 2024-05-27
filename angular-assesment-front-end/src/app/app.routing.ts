import { Routes, RouterModule } from "@angular/router";
import { AuthGuard, AnonymousGuard } from "./_guards";
import { HomeComponent } from "./home";
import { LoginComponent } from "./login";
import {
  AddressComponent,
  AddressEditComponent,
  AddressNewComponent,
} from "./address";
import { CRMComponent } from "./crm";
import { CampaignProductComponent } from "./campaign-product";
import { StyleComponent, StyleNewComponent, StyleEditComponent } from "./style";
import {
  PasswordResetComponent,
  PasswordResetSuccessComponent,
  PasswordResetConfirmComponent,
} from "./password-reset";
import { SalesPhraseComponent } from "./sales-phrase";
import { CanDeactivateGuard } from "./_guards/can-deactivate.guard";
import { PersonalInfoComponent } from "./personal-info";
import { AutoresponderComponent } from "./autoresponder/autoresponder.component";
import { AutoResponderEditComponent } from "./autoresponder/autoresponder-edit.component";
import { AutoresponderNewComponent } from "./autoresponder/autoresponder-new.component";

const appRoutes: Routes = [
  { path: "", component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: "autoresponders",
    component: AutoresponderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "autoresponder",
    canActivate: [AuthGuard],
    children: [
      {
        path: "edit/:id",
        component: AutoResponderEditComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: "new",
        component: AutoresponderNewComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
      },
    ],
  },
  {
    path: "user",
    children: [
      {
        path: "login",
        component: LoginComponent,
        canActivate: [AnonymousGuard],
      },
    ],
  },
  { path: "addresses", component: AddressComponent, canActivate: [AuthGuard] },
  {
    path: "address",
    canActivate: [AuthGuard],
    children: [
      {
        path: "edit/:id",
        component: AddressEditComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: "new",
        component: AddressNewComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
      },
    ],
  },
  { path: "crms", component: CRMComponent, canActivate: [AuthGuard] },
  {
    path: "campaign-products",
    component: CampaignProductComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: "Existing products" },
  },
  { path: "styles", component: StyleComponent, canActivate: [AuthGuard] },
  {
    path: "style",
    canActivate: [AuthGuard],
    children: [
      {
        path: "new",
        component: StyleNewComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: "edit/:id",
        component: StyleEditComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
      },
    ],
  },
  {
    path: "password",
    canActivate: [AnonymousGuard],
    children: [
      {
        path: "reset",
        canActivate: [AnonymousGuard],
        children: [
          {
            path: "",
            component: PasswordResetComponent,
            canActivate: [AnonymousGuard],
          },
          { path: "success", component: PasswordResetSuccessComponent },
          { path: "confirm", component: PasswordResetConfirmComponent },
        ],
      },
    ],
  },
  {
    path: "sales-phrases",
    component: SalesPhraseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "personal-info",
    canActivate: [AuthGuard],
    component: PersonalInfoComponent,
  },
  // otherwise redirect to home
  { path: "**", redirectTo: "" },
];

export const routing = RouterModule.forRoot(appRoutes);
