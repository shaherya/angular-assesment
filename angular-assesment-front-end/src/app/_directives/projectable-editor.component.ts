import {
  Component,
  ElementRef,
  Inject,
  NgZone,
  PLATFORM_ID,
  forwardRef,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { EditorComponent } from "@tinymce/tinymce-angular";

const EDITOR_COMPONENT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProjectableEditorComponent),
  multi: true,
};

@Component({
  selector: "projectable-editor",
  template: "<ng-template></ng-template>",
  styles: [":host { display: block; }"],
  providers: [EDITOR_COMPONENT_VALUE_ACCESSOR],
})
export class ProjectableEditorComponent extends EditorComponent {
  private _elementRef2: ElementRef;

  constructor(
    elementRef: ElementRef,
    ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    super(elementRef, ngZone, platformId);
    // this.elementRef is private. Need a duplicate
    this._elementRef2 = elementRef;
  }

  checkDomAttachment(): boolean {
    // check if component has been attached to DOM yet
    return document.body.contains(this._elementRef2.nativeElement);
  }

  public initialise() {
    if (!this._elementRef2 || !this.checkDomAttachment()) {
      // component is not in DOM. Try again in 200 ms.
      setTimeout(() => {
        this.initialise();
      }, 200);
    } else {
      super.initialise();
    }
  }
}
