import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environmens/environment';
import { Response } from 'src/app/shared/models/reponse';
import { OrderModel } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  getAll(params?: any, filter?:any): Observable<Response<OrderModel[]>> {
    return this.http.get<Response<OrderModel[]>>(env.orderApiUrl + `/orders/staffs/all-orders?pageIndex=${params?.pageIndex ? params.pageIndex - 1 : params.pageIndex}&pageSize=${params?.pageSize}&sortBy=${params?.sortBy}&sortType=${params?.sortType}&${filter}`)
  }
  getById(id: any, userId:number): Observable<Response<OrderModel>> {
    return this.http.get<Response<OrderModel>>(env.orderApiUrl + `/orders/staffs/order-by-id?id=` + id + '&userId=' + userId)
  }
  create(data:FormData) {
    return this.http.post<Response<OrderModel[]>>(env.orderApiUrl + '/orders/staffs', data)
  }
  update(data: FormData) {
    return this.http.put<Response<OrderModel[]>>(env.orderApiUrl + '/orders/staffs/update-order', data)
  }
  appendOrder(data:any) {
    return this.http.post<Response<OrderModel[]>>(env.orderApiUrl + '/orders/staffs/append-order', data)
  }
  cancelOrder(data:any) {
    return this.http.post<Response<OrderModel[]>>(env.orderApiUrl + '/orders/staffs/cancel-order', {id:data.id})
  }
}