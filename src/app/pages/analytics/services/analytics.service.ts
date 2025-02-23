import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { env } from "src/environmens/environment";
import { Response } from "src/app/shared/models/reponse";

@Injectable({
    providedIn: 'root'
  })
  export class AnalyticsService {
  
    constructor(private http: HttpClient) { }
  
    completedServicesCounts() {
        return this.http.get(env.adminUrl + '/analitics/completed-services/count')
    }
    completedServicesAmounts() {
        return this.http.get(env.adminUrl + '/analitics/completed-services/amounts')
    }
    completedServicesPercentages() {
        return this.http.get(env.adminUrl + '/analitics/completed-services/percentages')
    }
}