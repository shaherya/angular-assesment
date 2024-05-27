import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudService} from "./crud.service";

@Injectable()
export class SalesPhraseService extends CrudService {
  constructor(protected http: HttpClient) {
    super(http, 'sales_phrases');
  }
}
