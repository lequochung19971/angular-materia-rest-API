import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  EventEmitter
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

import {
  merge,
  Observable,
  of as observableOf,
  Subject,
  timer,
  fromEvent
} from 'rxjs';
import {
  catchError,
  map,
  startWith,
  switchMap,
  distinctUntilChanged,
  tap,
  debounce
} from 'rxjs/operators';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})
export class EmployeeTableComponent
  implements OnInit, OnDestroy, AfterViewInit {
  employeeList: MatTableDataSource<Employee>;

  private debounceTime: number = 0;
  private searchKey: string = '';
  private searchEvent = new EventEmitter();

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
    merge(this.sort.sortChange, this.pagi.page, this.searchEvent)
      .pipe(
        tap(_ => {
          if (this.searchKey.trim()) {
            this.debounceTime = 300;
            this.pagi.pageIndex = 0;
          } else {
            this.debounceTime = 0;
          }
        }),
        startWith({}),
        debounce(() => timer(this.debounceTime)),
        distinctUntilChanged(),
        switchMap(() => {
          this.checkLoadingService.isLoading$.next(true);
          return this.employeeServiceR.getEmployessForTable(
            this.sort.active ? this.sort.active : '',
            this.sort.direction,
            this.pagi.pageIndex + 1,
            this.pagi.pageSize,
            this.searchKey
          );
        }),
        map(data => {
          this.checkLoadingService.isLoading$.next(false);
          this.resLength = data.headers.get('X-Total-Count');
          return data.body;
        }),
        catchError(() => {
          this.checkLoadingService.isLoading$.next(false);
          this.notiService.openSnackBar('Disconnect to server', 'error');
          return observableOf([]);
        })
      )
      .subscribe(data => {
        this.employeeList = data;
      });
  }

  search(term: string) {
    this.searchEvent.emit(term);
  }

  clearSearchBox() {
    this.searchKey = '';
    this.searchEvent.emit('');
  }

  applyFilter() {
    this.employeeList.filter = this.searchKey.trim().toLowerCase();
  }

  reloadTableAfterSubmit() {
    this.employeeDialog
      .openEmployeeInfoDialog()
      .afterClosed()
      .subscribe(successed => {
        if (successed) {
          this.getEmployeesTableData();
          this.employeeServiceR.resetFormGroup();
        }
      });
  }

  openCreateEmployeeDialog() {
    this.reloadTableAfterSubmit();
  }

  openEditEmployeeDialog(data: Employee) {
    this.employeeServiceR.form.setValue(data);
    this.reloadTableAfterSubmit();
  }

  deleteEmployeeConfirm(id) {
    this.dialogConfirm
      .openConfirmDialog('Are you sure to delete this record ?')
      .afterClosed()
      .subscribe(res => {
        if (res) {
          console.log(res);
          this.employeeServiceR.deleteEmployee(id).subscribe(() => {
            this.notiService.openSnackBar('Deleted Successfully', 'warn');
            this.getEmployeesTableData();
          });
        }
      });
  }

  rowIsClicked(data) {
    console.log(data);
  }

  ngOnDestroy() {
    this.checkLoadingService.isLoading$.next(false);
    this.checkLoadingService.isLoading$.complete();
  }
}
