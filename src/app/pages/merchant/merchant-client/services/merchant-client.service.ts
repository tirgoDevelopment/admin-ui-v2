import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { env } from 'src/environmens/environment';
import { MerchantModel } from '../models/merchant.model';
import { Response } from 'src/app/shared/models/reponse';
@Injectable({
  providedIn: 'root'
})
export class MerchantClientService {
  private closeEvent = new Subject<any>();
  closeEvent$ = this.closeEvent.asObservable();

  constructor(private http: HttpClient) { }

  emitCloseEvent(data: any) {
    this.closeEvent.next(data);
  }

  getAll(params?: any, filter?: any): Observable<Response<MerchantModel[]>> {
    return this.http.get<Response<MerchantModel[]>>(`${env.adminUrl}/users/client-merchants` +
      `?pageIndex=${(params?.pageIndex ?? 1) - 1}` +
      `&pageSize=${params?.pageSize ?? ''}` +
      `&sortBy=${params?.sortBy ?? ''}` +
      `&sortType=${params?.sortType ?? ''}` +
      `&${filter ?? ''}`)
  }
  getVerified(params?: any, filter?: any): Observable<Response<MerchantModel[]>> {
    return this.http.get<Response<MerchantModel[]>>(`${env.adminUrl}/users/client-merchants/verified-client-merchants` +
      `?pageIndex=${(params?.pageIndex ?? 1) - 1}` +
      `&pageSize=${params?.pageSize ?? ''}` +
      `&sortBy=${params?.sortBy ?? ''}` +
      `&sortType=${params?.sortType ?? ''}` +
      `&${filter ?? ''}`)
  }
  getUnverified(): Observable<Response<MerchantModel[]>> {
    return this.http.get<Response<MerchantModel[]>>(`${env.adminUrl}/users/client-merchants/unverified-client-merchants`)
  }
  update(data: MerchantModel) {
    return this.http.put<Response<MerchantModel>>(`${env.adminUrl}/users/client-merchants/update-client-merchant`, data)
  }
  verify(id: number | string) {
    return this.http.patch<Response<MerchantModel>>(`${env.adminUrl}/users/client-merchants/verify-client-merchant?id=${id}`, {})
  }
  reject(id: number | string) {
    return this.http.patch<Response<MerchantModel>>(`${env.adminUrl}/users/client-merchants/reject-client-merchant?id=${id}`, {})
  }
  block(id: number | string) {
    return this.http.patch<Response<MerchantModel>>(`${env.adminUrl}/users/client-merchants/block-client-merchant?id=${id}`, {})
  }
  activate(id: number | string) {
    return this.http.patch<Response<MerchantModel>>(`${env.adminUrl}/users/client-merchants/activate-client-merchant?id=${id}`, {})
  }
  transactions(id:any,params?: any, filter?: any) {
    return this.http.get<Response<MerchantModel>>(`${env.adminUrl}/finance/transaction/admin-merchant-transactions?userId=`+id )
  }
}