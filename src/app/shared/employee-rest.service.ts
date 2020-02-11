import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Employee } from '../model/employee.model';

import * as _ from 'lodash';
import { ValidatorsService } from './validators.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRestService {
  private employeeUrl = 'http://localhost:3000/employees';

  form = new FormGroup(
    {
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
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.required
      ]),
      confirmPassword: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.required
      ]),
      city: new FormControl(''),
      gender: new FormControl('1'),
      department: new FormControl('', Validators.required),
      hireDate: new FormControl(new Date()),
      isPermanent: new FormControl(false)
    },
    {
      validators: this.validatorService.passwordMatchValidator.bind(this)
    }
  );

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorsService
  ) {}

  resetFormGroup() {
    this.form.reset();
    this.form.setValue({
      id: null,
      fullName: '',
      email: '',
      mobile: '',
      city: '',
      gender: '1',
      department: '',
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
    limit: number,
    searchKey?: string
  ): Observable<any> {
    const requestUrl = `${this.employeeUrl}?_sort=${sort}&_order=${order}&_page=${page}&_limit=${limit}&q=${searchKey}`;
    return this.http
      .get<any>(requestUrl, { observe: 'response' })
      .pipe(
        tap(_ => console.log('fected for table')),
        catchError(err => of(`Bad Promise: ${err}`))
      );
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http
      .post<any>(this.employeeUrl, employee, this.httpOptions)
      .pipe(
        tap(_ => console.log('added succesfully')),
        catchError(err => of(`Bad Promise: ${err}`))
      );
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    const requestUrl = `${this.employeeUrl}/${employee.id}`;
    return this.http.put<any>(requestUrl, employee, this.httpOptions).pipe(
      tap(_ => console.log(`updated id = ${employee.id}`)),
      catchError(err => of(`Bad Promise: ${err}`))
    );
  }

  deleteEmployee(id: string): Observable<any> {
    const requestUrl = `${this.employeeUrl}/${id}`;
    return this.http.delete<any>(requestUrl, this.httpOptions).pipe(
      tap(_ => console.log('Deleted succesfully')),
      catchError(err => of(`Bad Promise: ${err}`))
    );
  }
}
