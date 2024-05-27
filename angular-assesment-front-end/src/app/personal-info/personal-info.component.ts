import {Component} from "@angular/core";
import {CrudSaveComponent} from "../_directives";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {AlertService, PersonalInfoService, StorageService, UserService} from "../_services";
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../_models";

@Component({
  moduleId: module.id.toString(),
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent extends CrudSaveComponent {
  public user: User = null;
  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected infoService: PersonalInfoService,
    protected alertService: AlertService,
    protected formBuilder: FormBuilder,
    protected userService: UserService,
    protected storageService: StorageService
  ) {
    super(router, location, route, infoService, alertService);
    this.isNew = false
    this.objectName = 'personal info'
    this.title = 'Personal Info'
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
    })
    this.userService.getCurrent()
      .subscribe((user: User) => {
        this.id = user.id;
        this.user = user
        this.infoService.get(this.id)
          .subscribe((data: User) => {
            this._data$.next(data)
            this.form.patchValue(data);
          })
      },error => {
        this.handleError(error)
      })
  }

  protected onSaveComplete(data) {
    this.storageService.set('currentUser', {...this.user, ...data})
    this.loading = false
  }
}
