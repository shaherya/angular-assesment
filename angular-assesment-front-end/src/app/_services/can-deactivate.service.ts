import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

interface FormState {
  dirty: boolean
}

interface SaveModalEvent {
  event: string,
  open: boolean
}

interface RouteState {
  routeTo: string
}

@Injectable()
export class CanDeactivateService {
  private formState$: BehaviorSubject<FormState> = new BehaviorSubject<FormState>(null);
  private saveModalEvent$: BehaviorSubject<SaveModalEvent> = new BehaviorSubject<SaveModalEvent>(null);
  private routeState$: BehaviorSubject<RouteState> = new BehaviorSubject<RouteState>(null);

  setFormDirty(dirty: boolean) {
    this.formState$.next({dirty: dirty});
  }

  getFormStateObs() {
    return this.formState$.asObservable();
  }

  getFormState() {
    return this.formState$.getValue();
  }

  getSaveModalEventObs() {
    return this.saveModalEvent$.asObservable();
  }

  setSaveModalEvent(event: string, open: boolean) {
    this.saveModalEvent$.next({event, open});
  }

  getSaveModalEventValue() {
    return this.saveModalEvent$.value;
  }

  getRouteStateObs() {
    return this.routeState$.asObservable();
  }

  setRouteState(route: string) {
    this.routeState$.next({routeTo: route});
  }

  getCurrentRouteTo() {
    return this.routeState$.value? this.routeState$.value.routeTo: null;
  }

  canComponentDeactivate() {
    let formState: FormState = this.formState$.getValue();
    if (!formState) {
      return false;
    }
    return formState.dirty;
  }
}
