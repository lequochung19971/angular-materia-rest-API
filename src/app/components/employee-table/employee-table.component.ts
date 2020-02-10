import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  DoCheck
} from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { CheckLoadingService } from 'src/app/shared/check-loading.service';
import { DeparmentService } from 'src/app/shared/deparment.service';
import { Employee } from 'src/app/model/employee.model';
import { EmployeeInfoDialogService } from 'src/app/shared/employee-info-dialog.service';
import * as _ from 'lodash';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { EmployeeRestService } from 'src/app/shared/employee-rest.service';

import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})
export class EmployeeTableComponent implements OnInit, OnDestroy {
  employeeList: MatTableDataSource<Employee>;
  searchKey: string = '';

  displayedColumns: string[] = [
    'fullName',
    'email',
    'department',
    'mobile',
    'city',
    'actions'
  ];

  resLength: number = 0;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) pagi: MatPaginator;

  constructor(
    private employeeServiceR: EmployeeRestService,
    private employeeService: EmployeeService,
    private checkLoadingService: CheckLoadingService,
    private depService: DeparmentService,
    private employeeDialog: EmployeeInfoDialogService,
    private dialogConfirm: ConfirmDialogService,
    private notiService: NotificationService
  ) {}

  ngOnInit() {
    this.checkLoadingService.isLoading$.next(true);
  }

  ngAfterViewInit() {
    this.getEmployeesTableData();
  }

  getEmployeesTableData() {
    this.sort.sortChange.subscribe(() => (this.pagi.pageIndex = 0));
    merge(this.sort.sortChange, this.pagi.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.checkLoadingService.isLoading$.next(true);
          return this.employeeServiceR.getEmployessForTable(
            this.sort.active ? this.sort.active : '',
            this.sort.direction,
            this.pagi.pageIndex + 1,
            this.pagi.pageSize
          );
        }),
        map(data => {
          this.checkLoadingService.isLoading$.next(false);
          this.resLength = data.headers.get('X-Total-Count');
          return data.body;
        }),
        catchError(() => {
          this.checkLoadingService.isLoading$.next(false);
          return observableOf([]);
        })
      )
      .subscribe(data => {
        this.employeeList = data;
      });
  }

  clearSearchBox() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.employeeList.filter = this.searchKey.trim().toLowerCase();
  }

  openCreateEmployeeDialog() {
    this.employeeDialog
      .openEmployeeInfoDialog()
      .afterClosed()
      .subscribe(successed => {
        // this.employeeList.data.push(newEmployee);
        if (successed) {
          this.getEmployeesTableData();
        }
      });
  }

  openEditEmployeeDialog(data) {
    this.employeeService.form.setValue(_.omit(data, 'departmentName'));
    this.employeeDialog.openEmployeeInfoDialog();
  }

  deleteEmployeeConfirm(key) {
    this.dialogConfirm
      .openConfirmDialog('Are you sure to delete this record ?')
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.employeeService.deleteEmployee(key);
          this.notiService.openSnackBar('Deleted Successfully', 'warn');
        }
      });
  }

  ngOnDestroy() {
    this.checkLoadingService.isLoading$.next(false);
    this.checkLoadingService.isLoading$.complete();
  }
}
