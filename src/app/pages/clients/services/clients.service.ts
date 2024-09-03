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

  getAll(params?: any): Observable<Response<ClientModel[]>> {
    return this.http.get<Response<ClientModel[]>>(env.references + `/users/clients/all-clients?pageIndex=${params?.pageIndex}&pageSize=${params?.pageSize}&totalPagesCount=${params?.totalPagesCount}&sortBy=${params?.sortBy}&sortType=${params?.sortType}`)
  }
  create(data:FormData) {
    return this.http.post<Response<ClientModel[]>>(env.references + '/users/clients/create-client', data)
  }
  update(data: FormData) {
    return this.http.put<Response<ClientModel[]>>(env.references + '/users/clients/update-client', data)
  }
  delete(id: number | string) { 
    return this.http.delete(env.references + `/users/clients?id=${id}`)
  }
}