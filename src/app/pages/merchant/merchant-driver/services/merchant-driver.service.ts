import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, Subject } from 'rxjs';
import { env } from 'src/environmens/environment';
import { Response } from 'src/app/shared/models/reponse';
import { DriverMerchantModel } from '../models/driver-merchant.model';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
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
    return this.http.get<Response<DriverMerchantModel[]>>(`${env.apiUrl}/users/driver-merchants/verified-driver-merchants` +
      `?pageIndex=${(params?.pageIndex ?? 1)}` +
      `&pageSize=${params?.pageSize ?? ''}` +
      `&sortBy=${params?.sortBy ?? ''}` +
      `&sortType=${params?.sortType ?? ''}` +
      `&${filter ?? ''}`)
  }
  getUnverified(): Observable<Response<DriverMerchantModel[]>> {
    return this.http.get<Response<DriverMerchantModel[]>>(`${env.apiUrl}/users/driver-merchants/unverified-driver-merchants`)
  }
  verify(id: number | string) {
    return this.http.patch<Response<DriverMerchantModel>>(`${env.apiUrl}/users/driver-merchants/verify-driver-merchant?id=${id}`, {})
  }
  reject(id: number | string) {
    return this.http.patch<Response<DriverMerchantModel>>(`${env.apiUrl}/users/driver-merchants/reject-driver-merchant?id=${id}`, {})
  }
  update(data: DriverMerchantModel) {
    return this.http.put<Response<DriverMerchantModel>>(`${env.apiUrl}/users/driver-merchants/update-driver-merchant`, data)
  }
  block(id: number | string) {
    return this.http.patch<Response<DriverMerchantModel>>(`${env.apiUrl}/users/driver-merchants/block-driver-merchant?id=${id}`, {})
  }
  activate(id: number | string) {
    return this.http.patch<Response<DriverMerchantModel>>(`${env.apiUrl}/users/driver-merchants/unblock-driver-merchant?id=${id}`, {})
  }
  balanceTransactions(tmsId:any,params?: any, filter?: any) {
    return this.http.get<Response<DriverMerchantModel>>(`${env.apiUrl}/users/driver-merchants/${tmsId}/balance/transactions` )
  }
  tmsBalance(tmsId:any) {
    return this.http.get<Response<DriverMerchantModel>>(`${env.apiUrl}/users/driver-merchants/${tmsId}/balance`)
  }
  getMerchantDrivers() {
    return this.http.get(env.apiUrl+'/users/driver-merchants/all-driver-merchants')
  }
  getMerchantVerifiedDrivers() {
    return this.http.get(env.apiUrl+'/users/driver-merchants/verified-driver-merchants')
  }
  getById(id:any) {
    return this.http.get(env.apiUrl+'/users/driver-merchants/driver-merchant-by?id='+id)
  }
  topupBalance(data:any) {
    return this.http.post(env.apiUrl+`/users/driver-merchants/${data.tmsId}/balance-income`,data)
  }
  appendDriver(data:any) {
    return this.http.post(env.apiUrl+`/users/drivers/tmses/${data.tmsId}/assign`,data)
  }
  unassignDriver(data:any) {
    return this.http.post(env.apiUrl+`/users/drivers/tmses/${data.tmsId}/drivers/${data.driverId}/unassign`,{})
  }
  findTms(searchTerm: string, searchAs: string) {
    const filter = generateQueryFilter({ [searchAs]: searchTerm });
    return this.getVerified({}, filter).pipe(
      catchError(() => of({ data: { content: [] } }))
    );
  }
}