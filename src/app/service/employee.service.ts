import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { CheckLoadingService } from '../check-loading.service';

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

  dataEmployeesList: any[] = [];

  constructor(
    private firebase: AngularFireDatabase,
    private loadingService: CheckLoadingService
  ) {}

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

  fetchEmployees() {
    this.loadingService.set(true);
    this.getEmployees().subscribe(
      data => {
        let array = data.map(item => {
          return { $key: item.key, ...item.payload.val() };
        });
        this.dataEmployeesList = [...array];
        this.loadingService.set(false);
      },
      () => {
        this.loadingService.set(false);
      }
    );
  }

  insertEmployee(employee) {
    this.employeeList.push({
      fullName: employee.fullName,
      email: employee.email,
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
      email: employee.email,
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
