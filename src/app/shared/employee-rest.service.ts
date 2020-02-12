import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Employee } from '../model/employee.model';

import * as _ from 'lodash';
import { ValidatorsService } from './validators.service';
import { CheckLoadingService } from './check-loading.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRestService {
  private readonly API_URL = 'http://localhost:3000/employees';

  protected employeeDataChange: BehaviorSubject<
    Employee[]
  > = new BehaviorSubject<Employee[]>([]);
  protected dataLengthChange: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('0');

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

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
        Validators.required,
        this.validatorService.atLeastOneSpecialCharacter.bind(this),
        this.validatorService.atLeastOneNumber.bind(this),
        this.validatorService.atLeastOneSpecialCharacterAndNumber.bind(this)
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

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorsService,
    private checkLoadingService: CheckLoadingService
  ) {
    this.checkLoadingService.isLoading$.next(true);
  }

  get employeeDatas() {
    return this.employeeDataChange.value;
  }

  get dataLength() {
    return this.dataLengthChange.value;
  }

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
      password: '',
      confirmPassword: '',
      hireDate: new Date(),
      isPermanent: false
    });
  }

  getEmployeeDatas(): void {
    this.http.get<Employee[]>(this.API_URL).subscribe(data => {
      this.employeeDataChange.next(data);
    }),
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      };
  }

  getEmployessForTable(
    sort: string,
    order: string,
    page: number,
    limit: number,
    searchKey?: string
  ) {
    this.checkLoadingService.isLoading$.next(true);
    const requestUrl = `${this.API_URL}?_sort=${sort}&_order=${order}&_page=${page}&_limit=${limit}&q=${searchKey}`;
    this.http
      .get<any>(requestUrl, { observe: 'response' })
      .pipe(
        tap(data => {
          this.employeeDataChange.next(data.body);
          this.dataLengthChange.next(data.headers.get('X-Total-Count'));
          this.checkLoadingService.isLoading$.next(false);
        })
      )
      .subscribe();
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<any>(this.API_URL, employee, this.httpOptions).pipe(
      tap(_ => console.log('added succesfully')),
      catchError(err => of(`Bad Promise: ${err}`))
    );
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    const requestUrl = `${this.API_URL}/${employee.id}`;
    return this.http.put<any>(requestUrl, employee, this.httpOptions).pipe(
      tap(_ => console.log(`updated id = ${employee.id}`)),
      catchError(err => of(`Bad Promise: ${err}`))
    );
  }

  deleteEmployee(id: string): Observable<any> {
    const requestUrl = `${this.API_URL}/${id}`;
    return this.http.delete<any>(requestUrl, this.httpOptions).pipe(
      tap(_ => console.log('Deleted succesfully')),
      catchError(err => of(`Bad Promise: ${err}`))
    );
  }
}
