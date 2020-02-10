import { Injectable, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { CheckLoadingService } from './check-loading.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  @Output() isFilled = new EventEmitter();

  form = new FormGroup({
    $key: new FormControl(null),
    fullName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*')
    ]),
    email: new FormControl('', [Validators.email, Validators.required]),
    mobile: new FormControl('', [
      Validators.minLength(9),
      Validators.maxLength(20),
      Validators.required,
      Validators.pattern('[0-9]*')
    ]),
    city: new FormControl(''),
    gender: new FormControl('1'),
    department: new FormControl('dep1'),
    hireDate: new FormControl(new Date()),
    isPermanent: new FormControl(false)
  });

  private employeeList: AngularFireList<any>;

  constructor(private firebase: AngularFireDatabase) {}

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      fullName: '',
      email: '',
      mobile: '',
      city: '',
      gender: '1',
      department: 'dep1',
      hireDate: new Date(),
      isPermanent: false
    });
  }

  getEmployees() {
    this.employeeList = this.firebase.list('employees');
    return this.employeeList.snapshotChanges();
  }

  insertEmployee(employee) {
    this.employeeList.push({
      fullName: employee.fullName,
      email: employee.email,
      mobile: employee.mobile,
      city: employee.city,
      gender: employee.gender,
      department: employee.department,
      hireDate: employee.hireDate.toISOString(),
      isPermanent: employee.isPermanent
    });
  }

  updateEmployee(employee) {
    this.employeeList.update(employee.$key, {
      fullName: employee.fullName,
      email: employee.email,
      mobile: employee.mobile,
      city: employee.city,
      gender: employee.gender,
      department: employee.department,
      hireDate: employee.hireDate,
      isPermanent: employee.isPermanent
    });
  }

  deleteEmployee($key: string) {
    console.log(this.employeeList.remove($key));
  }
}
