import { BaseModel } from "src/app/shared/models/base-model";

export interface CargoStatusModel extends BaseModel {
    name?: string;
    code?: number;
}