import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationService } from "./pagination.service";

@Injectable()
export class CRMService extends PaginationService {
  constructor(protected http: HttpClient) {
    super(http, 'crm');
  }

  sync(id) {
    return this.http.post('crm/' + id.toString() + '/sync_campaigns/', {});
  }

}
