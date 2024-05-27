import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseModel } from '../_models';

export abstract class CrudService {
  constructor(protected http: HttpClient, protected route: string) {
  }

  list(queryParams?: any): Observable<any> {
    let options = {};

    if (queryParams) {
      options['params'] = new HttpParams({fromObject: queryParams});
    }

    return this.http.get<any>(this.route + '/', options);
  }

  get(id): Observable<BaseModel> {
    return this.http.get<any>(this.route + '/' + id.toString() + '/');
  }

  update(id, obj: BaseModel) {
    return this.http.put(this.route + '/' + id.toString() + '/', obj);
  }

  patch(id, data: {}) {
    return this.http.patch(this.route + '/' + id.toString() + '/', data);
  }

  delete(id) {
    return this.http.delete(this.route + '/' + id.toString() + '/');
  }

  create(obj: any) {
    return this.http.post(this.route + '/', obj);
  }

  preview(campaignId: string | number, data: any) {
    if (!data) {
      data = {}
    }

    return this.http.post(this.route + '/preview/', Object.assign(data, {campaign: campaignId}));
  }

  bulkUpdate(data: []) {
    return this.http.patch(this.route + '/bulk/', data);
  }

  bulkUpdateWithSameData(ids: (string | number)[], data: {}) {
    let updateData = [];

    ids.forEach((id: string | number) => {
      updateData.push(Object.assign({}, data, {id: id}));
    });

    return this.http.patch(this.route + '/bulk/', updateData);
  }

  getAllIds(filters) {
    return this.http.get(this.route + '/list_ids/', {params: filters});
  }
}
