import { BaseModel } from "src/app/shared/models/base-model";

export interface TransportKindModel extends BaseModel {
    name: string;
    isMode: boolean
    count: number;
    description?: string;
}