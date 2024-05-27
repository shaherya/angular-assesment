import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

interface GuiData {
  isSidebarExpanded?: boolean;
  title?: string;
}

@Injectable()
export class GuiService {
  private guiData: BehaviorSubject<GuiData> = new BehaviorSubject<GuiData>(
    {isSidebarExpanded: false, title: null});

  getGuiDataObs() {
    return this.guiData.asObservable();
  }

  setSidebarExpanded(expanded: boolean) {
    this.guiData.next({isSidebarExpanded: expanded});
  }

  setTitle(title: string) {
    this.guiData.next({title: title});
  }
}
