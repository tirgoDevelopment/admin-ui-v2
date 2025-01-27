import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
  transform(phoneNumber: string): string {
    if (!phoneNumber) return 'Invalid phone number';
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    const countryCodes = ['998', '7', '992', '996'];
    const countryCode = countryCodes.find(code => cleanedPhone.startsWith(code));

    if (countryCode) {
      const remainingNumber = cleanedPhone.slice(countryCode.length);
      return `+${countryCode} ${remainingNumber}`;
    }
    return phoneNumber;
  }
}
