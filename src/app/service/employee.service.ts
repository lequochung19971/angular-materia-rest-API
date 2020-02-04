import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  form = new FormGroup({
    $key: new FormControl(null),
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    mobile: new FormControl('', [
      Validators.required,
      Validators.minLength(10)
    ]),
    city: new FormControl(''),
    gender: new FormControl('1'),
    department: new FormControl(1),
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
      department: 1,
      hireDate: new Date(),
      isPermanent: false
    });
  }

  getEmployees() {
    this.employeeList = this.firebase.list('employees');
    return this.employeeList.snapshotChanges();
  }

  insertEmployee(employee) {
    console.log(employee.hireDate.toISOString());
    this.employeeList.push({
      fullName: employee.fullName,
      mobile: employee.mobile,
      city: employee.city,
      gender: employee.gender,
      dapartment: employee.department,
      hireDate: employee.hireDate.toISOString(),
      isPermanent: employee.isPermanent
    });
  }

  updateEmployee(employee) {
    this.employeeList.update(employee.$key, {
      fullName: employee.fullName,
      mobile: employee.mobile,
      city: employee.city,
      gender: employee.gender,
      dapartment: employee.department,
      hireDate: employee.hireDate.toISOString(),
      isPermanent: employee.isPermanent
    });
  }

  deleteEmployee($key: string) {
    this.employeeList.remove($key);
  }
}
