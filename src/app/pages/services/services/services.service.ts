import { env } from "src/environmens/environment";
import { ServiceModel } from "../models/service.model";
import { Observable } from "rxjs";
import { Response } from "src/app/shared/models/reponse";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class ServicesService {
    private readonly baseUrl = `${env.orderApiUrl}/references/driver-services`;
  
    constructor(private http: HttpClient) {}
  
    getServiceList(): Observable<Response<ServiceModel[]>> {
      return this.http.get<Response<ServiceModel[]>>(this.baseUrl);
    }
  
    getServiceById(id: number | string): Observable<Response<ServiceModel>> {
      return this.http.get<Response<ServiceModel>>(`${this.baseUrl}/${id}`);
    }
  
    postService(data: ServiceModel): Observable<Response<ServiceModel>> {
      return this.http.post<Response<ServiceModel>>(this.baseUrl, data);
    }
  
    putService(data: ServiceModel): Observable<Response<ServiceModel>> {
      return this.http.put<Response<ServiceModel>>(this.baseUrl, data);
    }
  
    deleteService(id: number | string): Observable<Response<ServiceModel>> {
      return this.http.delete<Response<ServiceModel>>(`${this.baseUrl}/${id}`);
    }
  }
  