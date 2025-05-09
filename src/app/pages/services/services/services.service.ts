import { env } from 'src/environmens/environment';
import { ServiceModel } from '../models/service.model';
import { Observable } from 'rxjs';
import { Response } from 'src/app/shared/models/reponse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private readonly baseStatusUrl = `${env.references}/references/services-requests-statuses`;
  private readonly baseRefUrl = `${env.references}/references/driver-services`;
  private readonly r = `${env.references}/references/`;

  private readonly baseUrl = `${env.apiUrl}/services-requests`;
  private readonly chatUrl = `${env.apiUrl}/services-requests`;


  constructor(private http: HttpClient) { }
  // REEFERENCES
  getServiceList(): Observable<Response<ServiceModel[]>> {
    return this.http.get<Response<ServiceModel[]>>(this.baseRefUrl);
  }
  getServiceById(id: number | string): Observable<Response<ServiceModel>> {
    return this.http.get<Response<ServiceModel>>(`${this.baseRefUrl}/${id}`);
  }
  postService(data: ServiceModel): Observable<Response<ServiceModel>> {
    return this.http.post<Response<ServiceModel>>(this.baseRefUrl, data);
  }
  putService(data: ServiceModel): Observable<Response<ServiceModel>> {
    return this.http.put<Response<ServiceModel>>(this.baseRefUrl, data);
  }
  deleteService(id: number | string): Observable<Response<ServiceModel>> {
    return this.http.delete<Response<ServiceModel>>(`${this.baseRefUrl}/${id}`);
  }
  changePriceStatus(data): Observable<Response<ServiceModel>> {
    return this.http.post<Response<ServiceModel>>(`${this.baseRefUrl}/${data.id}`, data)
  }


  // Service Status
  getServiceStatus() {
    return this.http.get(`${this.baseStatusUrl}`);
  }
  postServiceStatus(data: any) {
    return this.http.post(`${this.baseStatusUrl}`, data);
  }
  putServiceStatus(data: any) {
    return this.http.put(`${this.baseStatusUrl}`, data);
  }
  deleteServiceStatus(id: any) {
    return this.http.delete(`${this.baseStatusUrl}/${id}`);
  }
  // DRIVER SERVICES
  getDriverServices(params: any) {
    return this.http.get(`${this.baseUrl}${params}`);
  }
  getServicesByDriver(id: number | string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  getServiceRequestById(id: number | string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  postDriverServices(data: ServiceModel) {
    return this.http.post(`${this.baseUrl}`, data);
  }
  excelService(data) {
    return this.http.get(`${this.baseUrl}/excel/file?` + data, { responseType: 'blob' });
  }
  patchServiceStatus(data: any, apiPath: string) {
    return this.http.patch(`${this.baseUrl}${apiPath.replace('{id}', data.id)}`, data);
  }
  pricingService(data) {
    return this.http.patch(`${this.baseUrl}/${data.id}/price`, data)
  }
  requestKazJul(data) {
    return this.http.post(`${this.baseUrl}/kz-paid-way/transactions`, data)
  }
  // SERVICE CHAT
  getChatRooms( params) {
    return this.http.get(`${this.chatUrl}/chat/rooms${params}`);
  }
  getChatMessages(id: any, params?) {
    return this.http.get(`${this.chatUrl}/chat/${id}/messages${params}`);
  }
  postChatMessages(id: any, data: any) {
    return this.http.post(`${this.chatUrl}/chat/${id}/messages`, data);
  }
  postChatMessagesFiles(id: any, data: any) {
    return this.http.post(`${this.chatUrl}/chat/${id}/messages/files`, data);
  }
  patchServiceCount(id) {
    return this.http.post(`${this.chatUrl}/chat/${id}/messages/read`, {})
  }

  // KZ PAID WAY
  kzPaidWayAccount() {
    return this.http.get(`${this.r}kz-paid-way-account`);
  }
  putkzPaidWayAccount(data: any) {
    return this.http.put(`${this.r}/kz-paid-way-account`, data);
  }

  // Service Comments
  getServiceComments(id: any) {
    return this.http.get(`${this.baseUrl}/${id}/comments`);
  }
  postServiceComments(data: any) {
    return this.http.post(`${this.baseUrl}/comments`, data);
  }

}
