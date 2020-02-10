import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Employee } from '../model/employee.model';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRestService {
  private employeeUrl = 'http://localhost:3000/employees';

  form = new FormGroup({
    id: new FormControl(null),
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

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  initializeFormGroup() {
    this.form.setValue({
      id: null,
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

  getEmployees(): Observable<Employee[]> {
    return this.http
      .get<Employee[]>(this.employeeUrl)
      .pipe(tap(_ => console.log('fected')));
  }

  getEmployessForTable(
    sort: string,
    order: string,
    page: number,
    limit: number
  ): Observable<any> {
    const requestUrl = `${this.employeeUrl}?_sort=${sort}&_order=${order}&_page=${page}&_limit=${limit}`;
    return this.http
      .get<any>(requestUrl, { observe: 'response' })
      .pipe(tap(_ => console.log('fected for table')));
  }

  createEmployee(employee: Employee): Observable<Employee> {
    // const newEmployee = _.omit(employee, 'id');
    // newEmployee.hireDate = newEmployee.hireDate.toISOString();
    // console.log(newEmployee);
    return this.http
      .post<any>(this.employeeUrl, employee, this.httpOptions)
      .pipe(
        tap(_ => console.log('added succesfully')),
        catchError(_ => console.log)
      );
  }
}
