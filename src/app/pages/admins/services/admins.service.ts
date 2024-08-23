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
    return this.http.get<ResponseContent<AdminModel[]>>(env.apiUrl + `/users/staffs/all-staffs?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&totalPagesCount=${params.totalPagesCount}&sortBy=${params.sortBy}&sortType=${params.sortType}`);
  }

  getAllByStaff() {
    return this.http.get(env.apiUrl + '/users/staffs/staff-by');
  }

  create(data: any) {
    return this.http.post(env.apiUrl + '/users/staffs/create-staff', data);
  }

  update(data: any) {
    return this.http.put(env.apiUrl + '/users/staffs/update-staff', data);
  }

  delete(id: number | string) {
    return this.http.delete(env.apiUrl + `/users/staffs?id=${id}`);
  }
}