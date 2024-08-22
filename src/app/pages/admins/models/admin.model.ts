import { BaseModel } from "src/app/shared/models/base-model";

export interface AdminModel extends BaseModel {
    fio?: string;
    username?: string;
    fullName?: string;
    login?: string;
    role?: string;
    dataAt?: string;
    lastDateAt?: string;
    phone?: string;
    password?: string;
    phoneNumber?: string;
    phoneNumbers?: any[];
    active?: boolean;
    blocked?: boolean;
    user: {id: number, lastLogin: Date, userType: string, role: any};
}