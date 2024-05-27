import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { config } from '../../config/config';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-pager',
  templateUrl: 'pager.component.html'
})

export class PagerComponent implements OnInit, OnChanges {
  pageNumberLinks: number[] = [];
  count: number = 0;
  pageSize = config.defaultPageSize;
  maxPageNumberLinks: number = config.maxPageNumberLinks;
  @Input('page') page: number = 1;
  @Input('pageCount') pageCount: number;
  @Output('pageChange') pageChange: EventEmitter<any> = new EventEmitter<any>();
  @Input('pageSize') pageSizePassed: number
  @Input('sendPageEventOnInit') sendPageEventOnInit: boolean = true

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.page = parseInt(this.route.snapshot.params['page']) || 1; //override the initial input with what's passed in the query
    this.pageSize = parseInt(this.route.snapshot.params['page_size']) || this.pageSizePassed || config.defaultPageSize;
    if (this.sendPageEventOnInit) {
      this.sendPageEvent();
    }
  }

  ngOnChanges() {
    this.updatePageNumberLinks();
  }

  clickPage(page: number, event) {
    event.preventDefault();
    this.setPage(page);
    this.updatePageNumberLinks();
  }

  private setPage(page: number) {
    if ((page >= 1) && (page <= this.pageCount)) {
      this.page = page;
      this.sendPageEvent();
    }
  }

  private sendPageEvent() {
    this.pageChange.emit({page: this.page, page_size: this.pageSize});
  }

  private updatePageNumberLinks() {
    //set the page links
    let pages = [];
    let offset = Math.floor(this.maxPageNumberLinks / 2);
    let startPage = Math.max(1, this.page - offset);
    let endPage = Math.min(this.pageCount, this.page + offset);
    let numPages = (endPage - startPage) + 1;

    while (numPages < this.maxPageNumberLinks) {
      if (startPage > 1) {
        startPage--;
        numPages++;
      }
      if (endPage < this.pageCount) {
        endPage++;
        numPages++;
      }

      if ((startPage == 1) && (endPage == this.pageCount)) {
        break;
      }
    }

    if (numPages > this.maxPageNumberLinks) {
      endPage--;
      numPages--;
    }

    if ((startPage == 1) && (endPage < this.pageCount)) {
      endPage++; //we can account for one more link because we're at the beginning, but not the end
      numPages++;
    }
    else if ((startPage > 1) && (endPage == this.pageCount)) {
      startPage--; //we can account for one more link because we're at the end, but not the beginning
      numPages++;
    }

    if (startPage == 2) {
      startPage--; //show the number instead of a ...
      numPages++;
    }

    if (endPage == (this.pageCount - 1)) {
      endPage++; //show the number instead of a ...
      numPages++;
    }

    if (numPages > 1) {
      for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
      }
    }

    this.pageNumberLinks = pages;
  }

}
