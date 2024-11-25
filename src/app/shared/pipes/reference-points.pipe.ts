import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'referencePoints',
  pure: true 
})
export class ReferencePointsPipe implements PipeTransform {
  transform(data: any): [number, number][] {
    if (!data) return [];
    
    const locations = [
      data?.loadingLocation,
      data?.deliveryLocation,
      data?.customsInClearanceLocation,
      data?.customsOutClearanceLocation,
      data?.additionalLoadingLocation,
      data?.additionalDeliveryLocation,
    ];

    return locations
      .filter(location => location?.latitude && location?.longitude)
      .map(location => [location.latitude, location.longitude] as [number, number]);
  }
}
