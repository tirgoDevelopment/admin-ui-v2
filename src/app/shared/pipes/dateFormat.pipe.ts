import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | number, includeTime: boolean = true): string {
    const months = [
      "январь", "февраль", "март", "апрель", "май", "июнь",
      "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
    ];

    const date = new Date(value);

    const utcPlusFive = new Date(date.getTime() + (5 * 60 * 60 * 1000));

    const day = utcPlusFive.getUTCDate();
    const monthIndex = utcPlusFive.getUTCMonth();
    const year = utcPlusFive.getUTCFullYear();
    const hours = utcPlusFive.getUTCHours().toString().padStart(2, '0');
    const minutes = utcPlusFive.getUTCMinutes().toString().padStart(2, '0');

    let formattedDate = `${day} ${months[monthIndex]} ${year}`;

    if (includeTime) {
      formattedDate += ` в ${hours}:${minutes}`;
    }

    return formattedDate;
  }
}
