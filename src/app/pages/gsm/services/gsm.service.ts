import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { env } from "src/environmens/environment";

@Injectable({
    providedIn: 'root'
})
export class GSMService {

    constructor(private http: HttpClient) { }

    postGSMCardNumber(data) {
        return this.http.post(`${env.apiUrl}/users/drivers/${data.id}/gsm-card-number`, data);
    }
    topUpTmsGSMBalance(data) {
        return this.http.post(`${env.apiUrl}/users/driver-merchants/${data.tmsId}/gsm-balance-income`, data);
    }

    getTmsGSMTransactios(data) {
        return this.http.get(`${env.apiUrl}/users/driver-merchants/${data.id}/balance/transactions`);
    }
}