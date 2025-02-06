import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CurrencyModel } from "src/app/pages/references/currencies/models/currency.model";
import { Response } from "../../models/reponse";
import { env } from "src/environmens/environment";

@Injectable({
    providedIn: 'root'
})
export class CurrenciesService {

    constructor(private http: HttpClient) { }

    getAll(params?: any): Observable<Response<CurrencyModel[]>> {
        return this.http.get<Response<CurrencyModel[]>>(env.references + `/references/currencies`)
    }
    create(data: CurrencyModel) {
        return this.http.post<Response<CurrencyModel[]>>(env.references + '/references/currencies', data)
    }
    update(data: CurrencyModel) {
        return this.http.put<Response<CurrencyModel[]>>(env.references + '/references/currencies', data)
    }
    delete(id: number | string) {
        return this.http.delete(env.references + `/references/currencies/${id}`)
    }

} 