import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  constructor() {}

  uppercaseFirstOfEachLetter(str: string) {
    let strBeConvert = str
      .split(' ')
      .map(str => {
        return (
          str
            .toLowerCase()
            .charAt(0)
            .toUpperCase() + str.toLowerCase().slice(1)
        );
      })
      .join(' ');
    return strBeConvert;
  }
}
