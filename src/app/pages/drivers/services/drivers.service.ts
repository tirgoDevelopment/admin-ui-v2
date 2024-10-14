import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environmens/environment';
import { Response } from 'src/app/shared/models/reponse';
import { DriverModel } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  constructor(private http: HttpClient) { }

  getAll(params?: any, filter?:any): Observable<Response<DriverModel[]>> {
    return this.http.get<Response<DriverModel[]>>(`${env.apiUrl}/users/drivers/all-drivers` +
    `?pageIndex=${(params?.pageIndex ?? 1) - 1}` +
    `&pageSize=${params?.pageSize ?? ''}` +
    `&state=notDeleted` +
    `&sortBy=${params?.sortBy ?? ''}` +
    `&sortType=${params?.sortType ?? ''}` +
    `&${filter ?? ''}`)
  }
  getById(id: any, userId:number): Observable<Response<DriverModel>> {
    return this.http.get<Response<DriverModel>>(env.apiUrl + `/users/drivers/driver-by-id?id=` + id + '&userId=' + userId)
  }
  create(data:FormData) {
    return this.http.post<Response<DriverModel[]>>(env.apiUrl + '/users/drivers/create-driver', data)
  }
  update(data: FormData) {
    return this.http.put<Response<DriverModel[]>>(env.apiUrl + '/users/drivers/update-driver', data)
  }
  delete(id: number | string) { 
    return this.http.delete(env.apiUrl + `/users/drivers?id=${id}`)
  }
  block(id: number | string) {
    return this.http.patch<Response<DriverModel>>(env.apiUrl + `/users/drivers/block-driver?id=${id}`, {})
  }
  unblock(id: number | string) {
    return this.http.patch<Response<DriverModel>>(env.apiUrl + `/users/drivers/unblock-driver?id=${id}`, {})
  }
  updateTransport(data:any) {
    return this.http.put<Response<DriverModel[]>>(env.apiUrl + '/users/driver/update-transport', data)
  }
  createTransport(data:any) {
    return this.http.post<Response<DriverModel[]>>(env.apiUrl + '/users/driver/add-transport', data)
  }
}