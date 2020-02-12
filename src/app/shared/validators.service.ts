import { Injectable } from '@angular/core';
import {
  FormControl,
  ValidationErrors,
  ValidatorFn,
  AbstractControl,
  FormGroup
} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  constructor() {}

  passwordMatchValidator(group: FormGroup) {
    const password: string = group.get('password').value;
    const confirmPassword: string = group.get('confirmPassword').value;
    if (password !== confirmPassword) {
      group.get('confirmPassword').setErrors({ passwordNotMatch: true });
    }
  }

  atLeastOneNumber(control: AbstractControl) {
    const password: string = control.value;
    if (!/^(?=.*[0-9])/.test(password)) {
      return { nonNumber: true };
    }
    return null;
  }

  atLeastOneSpecialCharacter(control: AbstractControl) {
    const password: string = control.value;
    if (!/^(?=.*[!@#$%^&*])/.test(password)) {
      return { nonSpecial: true };
    }
    return null;
  }

  atLeastOneSpecialCharacterAndNumber(control: AbstractControl) {
    const password: string = control.value;
    if (!/^(?=.*[0-9])|(?=.*[!@#$%^&*])/.test(password)) {
      return { nonSpecialAndNumber: true };
    }
    return null;
  }
}
