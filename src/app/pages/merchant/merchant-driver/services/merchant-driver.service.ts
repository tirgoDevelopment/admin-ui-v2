import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { env } from 'src/environmens/environment';
import { Response } from 'src/app/shared/models/reponse';
import { DriverMerchantModel } from '../models/driver-merchant.model';
@Injectable({
  providedIn: 'root'
})
export class MerchantDriverService {
  private closeEvent = new Subject<any>();
  closeEvent$ = this.closeEvent.asObservable();

  constructor(private http: HttpClient) { }
  emitCloseEvent(data: any) {
    this.closeEvent.next(data);
  }
  getVerified(params?: any, filter?: any): Observable<Response<DriverMerchantModel[]>> {
    return this.http.get<Response<DriverMerchantModel[]>>(`${env.adminUrl}/users/driver-merchants/verified-driver-merchants` +
      `?pageIndex=${(params?.pageIndex ?? 1) - 1}` +
      `&pageSize=${params?.pageSize ?? ''}` +
      `&sortBy=${params?.sortBy ?? ''}` +
      `&sortType=${params?.sortType ?? ''}` +
      `&${filter ?? ''}`)
  }
  getUnverified(): Observable<Response<DriverMerchantModel[]>> {
    return this.http.get<Response<DriverMerchantModel[]>>(`${env.adminUrl}/users/driver-merchants/unverified-driver-merchants`)
  }
  verify(id: number | string) {
    return this.http.patch<Response<DriverMerchantModel>>(`${env.adminUrl}/users/driver-merchants/verify-driver-merchant?id=${id}`, {})
  }
  reject(id: number | string) {
    return this.http.patch<Response<DriverMerchantModel>>(`${env.adminUrl}/users/driver-merchants/reject-driver-merchant?id=${id}`, {})
  }
  update(data: DriverMerchantModel) {
    return this.http.put<Response<DriverMerchantModel>>(`${env.adminUrl}/users/driver-merchants/update-driver-merchant`, data)
  }
  block(id: number | string) {
    return this.http.patch<Response<DriverMerchantModel>>(`${env.adminUrl}/users/driver-merchants/block-driver-merchant?id=${id}`, {})
  }
  activate(id: number | string) {
    return this.http.patch<Response<DriverMerchantModel>>(`${env.adminUrl}/users/driver-merchants/unblock-driver-merchant?id=${id}`, {})
  }
  transactions(id:any,params?: any, filter?: any) {
    return this.http.get<Response<DriverMerchantModel>>(`${env.adminUrl}/finance/transaction/driver-merchant-transactions?userId=`+id )
  }
  getMerchantDrivers() {
    return this.http.get(env.adminUrl+'/users/driver-merchants/all-driver-merchants')
  }
  getMerchantVerifiedDrivers() {
    return this.http.get(env.adminUrl+'/users/driver-merchants/verified-driver-merchants')
  }
}