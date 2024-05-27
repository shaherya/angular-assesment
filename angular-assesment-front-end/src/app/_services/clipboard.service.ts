import { Injectable } from '@angular/core';

@Injectable()
export class ClipboardService {
  private type;

  constructor() {
    this.type = 'generic';
  }

  setType(type: string) {
    this.type = type;
  }

  copy(key: string, data: any) : void {
    sessionStorage.setItem(this.getKey(key), JSON.stringify(data));
  }

  canPaste(key: string) : boolean {
    return !!sessionStorage.getItem(this.getKey(key));
  }

  paste(key: string) : any {
    const clipboard = sessionStorage.getItem(this.getKey(key));

    if (clipboard) {
      return JSON.parse(clipboard);
    }

    return null;
  }

  clearSelection(key: string) : void {
    sessionStorage.removeItem(this.getKey(key));
  }

  private getKey(key: string) {
    return 'clipboard_' + key;
  }
}
