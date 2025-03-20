import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environmens/environment';
import { Response } from 'src/app/shared/models/reponse';
import { ClientModel } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private http: HttpClient) { }

  getAll(params?: any, filter?: any): Observable<Response<ClientModel[]>> {
    return this.http.get<Response<ClientModel[]>>(`${env.apiUrl}/clients?${filter}`,{params})
  }
  getById(id: any): Observable<Response<ClientModel>> {
    return this.http.get<Response<ClientModel>>(env.apiUrl + `/clients/` + id)
  }
  create(data: FormData) {
    return this.http.post<Response<ClientModel[]>>(env.apiUrl + '/clients', data)
  }
  update(data: FormData) {
    return this.http.put<Response<ClientModel[]>>(env.apiUrl + '/clients', data)
  }
  delete(id: number | string) {
    return this.http.delete(env.apiUrl + `/clients/${id}`)
  }
  block(id: number | string) {
    return this.http.patch<Response<ClientModel>>(env.apiUrl + `/clients/${id}/block`, {})
  }
  unblock(id: number | string) {
    return this.http.patch<Response<ClientModel>>(env.apiUrl + `/clients/${id}/unblock`, {})
  }
}