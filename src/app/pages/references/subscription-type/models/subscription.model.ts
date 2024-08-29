import { BaseModel } from "src/app/shared/models/base-model";

export interface SubscriptionModel extends BaseModel {
    name: string;
    value: number;
    duration: number;
}