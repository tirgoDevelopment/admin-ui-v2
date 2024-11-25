import { BaseModel } from "src/app/shared/models/base-model";
import { CargoStatusModel } from "../../references/cargo-status/models/cargo-status.model";
import { TransportKindModel } from "../../references/transport-kinds/models/transport-kinds.model";
import { ClientModel } from "../../clients/models/client.model";
import { CargoTypesModel } from "../../references/cargo-types/models/cargo-type.model";

export interface OrderModel extends BaseModel {
    clientId?: string,
    clientMerchant?: ClientModel,
    sendDate?: Date,
    loadingLocation?:any,
    deliveryLocation?:any,
    cargoStatus: CargoStatusModel,
    selectedLocations?: Array<'customsInClearanceLocation' | 'customsOutClearanceLocation' | 'additionalLoadingLocation' | 'additionalDeliveryLocation'>;
    customsOutClearanceLocation?: any,
    customsInClearanceLocation?: any,
    additionalLoadingLocation?: any,
    additionalDeliveryLocation?: any,
    isUrgent?: boolean,
    isTwoDays?: boolean,
    isAdr?: boolean,
    isCarnetTir?: boolean,
    isGlonas?: boolean,
    isParanom?: boolean,
    offeredPrice?: string,
    offeredPriceCurrencyId?: string,
    offeredPriceCurrency: any,
    inAdvancePrice?: [0],
    inAdvancePriceCurrencyId?: string,
    inAdvancePriceCurrency: any,
    paymentMethod?: string,
    isSecureTransaction?: boolean,
    transportKindIds?: string,
    transportKinds: TransportKindModel[],
    transportTypeIds?: string,
    transportTypes: any[],
    refrigeratorFrom?: string,
    refrigeratorTo?: string,
    refrigeratorCount?: string,
    isHook?: string,
    cargoTypeId?: string,
    cargoType?: CargoTypesModel,
    cargoWeight?: string,
    cargoLength?: string,
    cargoWidth?: string,
    cargoHeight?: string,
    cubature?: string,
    cargoPackageId?: string,
    loadingMethodId?: string
    client?: ClientModel,
    cisternVolume: number,
    containerVolume: number,
    cargoLoadMethods: any,
    cargoPackage: any,
    capacity: number,
    cargoDimension: string,
    transportType: any,
    isBorderCrossing:boolean,
    isCashlessPayment: boolean,
    driverOrderOffers:any
}