import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environmens/environment';
import { Response } from '../../../shared/models/reponse';
import { Observable } from 'rxjs';
import { AdminModel } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminsService {

  constructor(private http: HttpClient) { }

  getAll(params:any): Observable<Response<AdminModel[]>> {
    return this.http.get<Response<AdminModel[]>>(env.apiUrl + `/users/staffs/all-staffs?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&totalPagesCount=${params.totalPagesCount}&sortBy=${params.sortBy}&sortType=${params.sortType}`);
  }

  getAllByStaff() {
    return this.http.get(env.apiUrl + '/users/staffs/staff-by');
  }

}