import { BaseModel } from "src/app/shared/models/base-model";

export interface CurrencyModel extends BaseModel {
    name: string;
    code: number;
}