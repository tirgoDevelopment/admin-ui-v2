import { BaseModel } from "src/app/shared/models/base-model";
import { MerchantModel } from "../../merchant/merchant-client/models/merchant.model";

export interface DriverModel extends BaseModel {
    rowIndex:number;
    name?: string;
    full_name?: string;
    contry_code?: string;
    firstName?:string;
    email?: string;
    lastName?: string;
    citizenship?: string;
    password?: string;
    phoneNumbers?:any[];
    driverTransports?:any[],
    phoneNumber?:string;
    phone?: string;
    type?: string;
    moderation?: string;
    register_date?: Date;
    last_enter?: Date;
    order?: boolean;
    geolocation?: boolean;
    subscribedAt?:string;  
    subscription?:any;
    driverLicense?:string;
    passport?:string;
    isBlocked?:boolean;
    passportFilePath:string;
    driverLicenseFilePath:string;
    isBusy?:boolean;
    canceledOrdersCount:number;
    isVerified:boolean;
    profileFile?:any;
    isOwnBalance?:boolean;
    isOwnService?:boolean;
    isOwnOrder?:boolean;
    isKzPaidWay?:boolean;
    serviceBalance?:number;
    tirgoBalance?:number;
    gsmCardNumber: string;
    gsmBalance: string | number;
    user: {
        id: number;
        lastLogin: Date;
    }
    // driverMerchant?:MerchantModel;
    tms: MerchantModel
}