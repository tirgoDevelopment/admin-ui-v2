import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environmens/environment';
import { Response } from 'src/app/shared/models/reponse';
import { ArchiveUserModel } from '../models/archive-user.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private http: HttpClient) { }

  getAll(params?: any, filter?: any): Observable<Response<ArchiveUserModel[]>> {
    return this.http.get<Response<ArchiveUserModel[]>>(`${env.adminUrl}/users/archive` +
      `?pageIndex=${(params?.pageIndex ?? 1) - 1}` +
      `&pageSize=${params?.pageSize ?? ''}` +
      `&sortBy=${params?.sortBy ?? ''}` +
      `&sortType=${params?.sortType ?? ''}` +
      `&${filter ?? ''}`)
  }
}