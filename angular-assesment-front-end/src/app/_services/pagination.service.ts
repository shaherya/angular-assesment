import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudService } from "./crud.service";

export abstract class PaginationService extends CrudService {
  constructor(protected http: HttpClient, protected route: string) {
    super(http, route);
  }

  list(queryParams: any): Observable<any> {
    let params = new HttpParams({fromObject: queryParams});

    return this.http.get<any>(this.route + '/', {params: params});
  }
}
