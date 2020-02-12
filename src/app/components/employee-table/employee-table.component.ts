import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  EventEmitter
} from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { CheckLoadingService } from 'src/app/shared/check-loading.service';
import { Employee } from 'src/app/model/employee.model';
import { EmployeeInfoDialogService } from 'src/app/shared/employee-info-dialog.service';
import * as _ from 'lodash';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { EmployeeRestService } from 'src/app/shared/employee-rest.service';

import { merge, timer } from 'rxjs';
import { startWith, tap, debounce } from 'rxjs/operators';

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
    private employeeDialog: EmployeeInfoDialogService,
    private dialogConfirm: ConfirmDialogService,
    private notiService: NotificationService
  ) {}

  ngOnInit() {}

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
        debounce(() => timer(300)),
        tap(_ => {
          this.employeeServiceR.getEmployessForTable(
            this.sort.active ? this.sort.active : '',
            this.sort.direction,
            this.pagi.pageIndex + 1,
            this.pagi.pageSize,
            this.searchKey
          );
        })
      )
      .subscribe();
  }

  refreshTable(): void {
    this.getEmployeesTableData();
  }

  onSearch(term: string) {
    this.searchKey = term;
    this.searchEvent.emit(term);
  }

  reloadTableAfterSubmit() {
    this.employeeDialog
      .openEmployeeInfoDialog()
      .afterClosed()
      .subscribe(successed => {
        if (successed) {
          this.refreshTable();
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
          this.employeeServiceR.deleteEmployee(id).subscribe(() => {
            this.notiService.openSnackBar('Deleted Successfully', 'warn');
            this.refreshTable();
          });
        }
      });
  }

  ngOnDestroy() {
    this.checkLoadingService.isLoading$.next(false);
    this.checkLoadingService.isLoading$.complete();
  }
}


https://blog.strongbrew.io/rxjs-best-practices-in-angular/