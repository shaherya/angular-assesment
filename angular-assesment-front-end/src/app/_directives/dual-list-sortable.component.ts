import {Component, Output, EventEmitter} from '@angular/core';
import {DualListComponent} from 'angular-dual-listbox';

@Component({
  selector: 'dual-list-sortable',
  templateUrl: './dual-list-sortable.component.html',
  styleUrls: ['./dual-list-sortable.component.css']
})
export class DualListSortableComponent extends DualListComponent {
  @Output('onSorted') onSorted: EventEmitter<Array<any>> = new EventEmitter<Array<any>>()

  sortableDragSuccess() {
    this.onSorted.emit(this.confirmed.sift.map(item => {
      return {id: this.getItemId(item), name: this.getItemName(item)}
    }))
  }

  getItemId(item) {
    return item._id
  }

  getItemName(item) {
    return item._name
  }
}
