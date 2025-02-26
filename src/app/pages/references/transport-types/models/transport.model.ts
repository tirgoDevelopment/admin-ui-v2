import { BaseModel } from "src/app/shared/models/base-model";


export interface TransportModel extends BaseModel {
    brand: any;
    weight?: number;
    volume?: number;
    loading_side?: string;
    type?: number;
    trailer?: number;
    transportKindId?: string;
    transportKind?: {name:string, id: number};
    transportTypeId?: string;
    transportType?: {name:string, id: number};
    capacity?: string;
    transportNumber: string;
    stateNumberTrailer?: string;
    refrigeratorFrom?: string;
    refrigeratorTo?: string;
    refrigeratorCount?: string;
    isHook?: boolean;
    isAdr?: boolean;
    heightCubature?: string;
    transportKindIds?: any[];
    transportTypeIds?: any[];
    cargoLoadMethodIds?: any[];
    techPassportFrontFilePath?: string;
    techPassportBackFilePath?: string;
    goodsTransportationLicenseCardFilePath?: string;
    cargoTypeIds?: any[];
    loadFrom?: string;
    loadTo?: string;
    cisternVolume: number;
    isVerified:boolean;
    isRefrigerator:any;
    isMain:boolean;
    cargoLoadMethods:any;
    isKzPaidWay: boolean;
}