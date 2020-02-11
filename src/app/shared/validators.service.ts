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
}
