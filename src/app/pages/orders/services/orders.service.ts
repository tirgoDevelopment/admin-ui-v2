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
    return this.http.get<Response<OrderModel[]>>(env.apiUrl + `/orders${filter}`,{params})
  }
  getById(id: any): Observable<Response<OrderModel>> {
    return this.http.get<Response<OrderModel>>(env.apiUrl + `/orders/${id}`)
  }
  create(data:OrderModel) {
    return this.http.post<Response<OrderModel[]>>(env.apiUrl + '/orders', data)
  }
  update(data: OrderModel) {
    return this.http.put<Response<OrderModel[]>>(env.apiUrl + `/orders/${data.id}`, data)
  }
  appendOrder(data:any) {
    return this.http.post<Response<OrderModel[]>>(env.apiUrl + `/orders/${data.orderId}/assign`, data)
  }
  cancelOrder(data:any) {
    return this.http.post<Response<OrderModel[]>>(env.apiUrl + `/orders/${data.id}/cancel`,{})
  }
 
  acceptOffer(data:any) {
    return this.http.post(env.apiUrl + `/orders/${data.orderId}/offers/${data.id}/accept`,data)
  }

  sendOffer(data:any) {
    return this.http.post(env.apiUrl + `/orders/${data.orderId}/offers`,data)
  }
  replyToDriverOffer(data:any) {
    return this.http.post(env.apiUrl + `/orders/${data.orderId}/offers/${data.offerId}/reply`,data)
  }

  rejectDriverOffer(data:any) {
    return this.http.post(env.apiUrl + `/orders/${data.orderId}/offers/${data.offerId}/reject`,data)
  }
  rejectClientOffer(data:any) {
    return this.http.post(env.apiUrl + `/orders/${data.orderId}/offers/replies/${data.offerId}/reject`,data)
  }

  acceptDriverOffer(data:any) {
    return this.http.post(env.apiUrl + `/orders/${data.orderId}/offers/${data.offerId}/accept`,data)
  }
  acceptClientOffer(data:any) {
    return this.http.post(env.apiUrl + `/orders/${data.orderId}/staffs/offers/replies/${data.offerId}/accept`,data)
  }

  changeStatusOrder(data) {
    return this.http.post(env.apiUrl + `/orders/${data.orderId}/staffs/${data.status}`,{})
  }
}