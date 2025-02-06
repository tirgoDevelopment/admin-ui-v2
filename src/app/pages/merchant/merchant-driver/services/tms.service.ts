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
export class TmsService {
  private closeEvent = new Subject<any>();
  closeEvent$ = this.closeEvent.asObservable();

  constructor(private http: HttpClient) { }
  emitCloseEvent(data: any) {
    this.closeEvent.next(data);
  }
  getVerified(params?: any): Observable<Response<DriverMerchantModel[]>> {
    return this.http.get<Response<DriverMerchantModel[]>>(`${env.apiUrl}/tmses${params}`)
  }
  getById(id: any) {
    return this.http.get(env.apiUrl + '/tmses/' + id)
  }
  post(data: DriverMerchantModel) {
    return this.http.post<Response<DriverMerchantModel>>(`${env.apiUrl}/tmses`, data)
  }
  update(data: DriverMerchantModel) {
    return this.http.put<Response<DriverMerchantModel>>(`${env.apiUrl}/tmses/${data.id}`, data)
  }
  delete(id) {
    return this.http.delete(`${env.apiUrl}/tmses/${id}`)
  }

  verify(id: number | string) {
    return this.http.patch<Response<DriverMerchantModel>>(`${env.apiUrl}/tmses/${id}/verify`, {})
  }
  reject(id: number | string) {
    return this.http.patch<Response<DriverMerchantModel>>(`${env.apiUrl}/tmses/${id}/reject`, {})
  }
  block(id: number | string) {
    return this.http.patch<Response<DriverMerchantModel>>(`${env.apiUrl}/tmses/${id}/block`, {})
  }
  activate(id: number | string) {
    return this.http.patch<Response<DriverMerchantModel>>(`${env.apiUrl}/tmses/${id}/unblock`, {})
  }
  balanceTransactions(tmsId: any, params?: any, filter?: any) {
    return this.http.get<Response<DriverMerchantModel>>(`${env.apiUrl}/tmses/${tmsId}/balances/transactions`)
  }
  tmsBalance(tmsId: any) {
    return this.http.get<Response<DriverMerchantModel>>(`${env.apiUrl}/tmses/${tmsId}/balances`)
  }

  topupBalance(data: any) {
    return this.http.post(env.apiUrl + `/tmses/${data.tmsId}/balances`, data)
  }
  appendDriver(data: any) {
    return this.http.post(env.apiUrl + `/drivers/tmses/${data.tmsId}/assign`, data)
  }
  unassignDriver(data: any) {
    return this.http.post(env.apiUrl + `/drivers/${data.driverId}/tmses/${data.tmsId}/unassign`, {})
  }
  findTms(searchTerm: string, searchAs: string) {
    const filter = generateQueryFilter({ [searchAs]: searchTerm });
    return this.getVerified(filter).pipe(
      catchError(() => of({ data: { content: [] } }))
    );
  }
}