import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environmens/environment';
import { Observable } from 'rxjs';
import { AdminModel } from '../models/admin.model';
import { ResponseContent } from 'src/app/shared/models/res-content.model';

@Injectable({
  providedIn: 'root'
})
export class AdminsService {

  constructor(private http: HttpClient) { }

  getAll(params: any): Observable<ResponseContent<AdminModel[]>> {
    return this.http.get<ResponseContent<AdminModel[]>>(env.apiUrl + `/accounts?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&totalPagesCount=${params.totalPagesCount}&sortBy=${params.sortBy}&sortType=${params.sortType}`);
  }
  create(data: AdminModel) {
    return this.http.post(env.apiUrl + `/accounts`, data);
  }

  update(data: AdminModel) {
    return this.http.put(env.apiUrl + `/accounts`, data);
  }

  delete(id: number | string) {
    return this.http.delete(env.apiUrl + `/accounts/admins?id=${id}`);
  }
}