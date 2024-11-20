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
    return this.http.get<Response<OrderModel[]>>(env.orderApiUrl + `/orders/staffs?${filter}`,{params})
  }
  getById(id: any): Observable<Response<OrderModel>> {
    return this.http.get<Response<OrderModel>>(env.orderApiUrl + `/orders/${id}/staffs`)
  }
  create(data:OrderModel) {
    return this.http.post<Response<OrderModel[]>>(env.orderApiUrl + '/orders/staffs', data)
  }
  update(data: OrderModel) {
    return this.http.put<Response<OrderModel[]>>(env.orderApiUrl + `/orders/${data.id}/staffs`, data)
  }
  appendOrder(data:any) {
    return this.http.post<Response<OrderModel[]>>(env.orderApiUrl + '/orders/staffs/append-order', data)
  }
  cancelOrder(data:any) {
    return this.http.post<Response<OrderModel[]>>(env.orderApiUrl + `/orders/${data.id}/staffs/cancel`,{})
  }
}