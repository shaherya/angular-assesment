import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationService } from "./pagination.service";

@Injectable()
export class CampaignProductService extends PaginationService {
  constructor(protected http: HttpClient) {
    super(http, 'campaign_products');
  }
}
