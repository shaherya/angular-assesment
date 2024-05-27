import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PaginationService } from "./pagination.service";

@Injectable()
export class AutoResponderService extends PaginationService {
  constructor(protected http: HttpClient) {
    super(http, "autoresponders");
  }
}
