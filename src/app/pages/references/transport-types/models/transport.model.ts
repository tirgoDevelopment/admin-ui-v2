import { BaseModel } from "src/app/shared/models/base-model";


export interface TransportModel extends BaseModel {
    name: string;
    weight?: number;
    volume?: number;
    loading_side?: string;
    type?: number;
    trailer?: number;
}