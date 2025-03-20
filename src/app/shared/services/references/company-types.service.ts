import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { env } from "src/environmens/environment";

@Injectable({
    providedIn: 'root'
})
export class CompanyTypesService {
    constructor(private http: HttpClient) { }

    getAll(params?) {
        return this.http.get(env.references + `/references/company-types`)
    }
    create(data) {
        return this.http.post(env.references + '/references/company-types', data)
    }
    update(data) {
        return this.http.put(env.references + '/references/company-types', data)
    }
    delete(id: number | string) {
        return this.http.delete(env.references + `/references/company-types/${id}`)
    }
}