import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { CheckLoadingService } from 'src/app/check-loading.service';
import { DeparmentService } from 'src/app/shared/deparment.service';
import { Employee } from 'src/app/model/employee.model';
import { EmployeeInfoDialogService } from 'src/app/shared/employee-info-dialog.service';
import * as _ from 'lodash';

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

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) pagi: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private checkLoadingService: CheckLoadingService,
    private depService: DeparmentService,
    private employeeDialog: EmployeeInfoDialogService
  ) {
    checkLoadingService.set(true);
  }

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(
      data => {
        let array = data.map(item => {
          let departmentName = this.depService.getDepartmentName(
            item.payload.val()['department']
          );

          return {
            $key: item.key,
            departmentName,
            ...item.payload.val()
          };
        });

        this.employeeList = new MatTableDataSource(array);
        this.checkLoadingService.set(false);
        this.employeeList.sort = this.sort;
        this.employeeList.paginator = this.pagi;
        this.employeeList.filterPredicate = (data, filter) => {
          return this.displayedColumns.some(elem => {
            return (
              elem != 'actions' &&
              data[elem].toLowerCase().indexOf(filter) != -1
            );
          });
        };
      },
      () => {
        this.checkLoadingService.set(false);
      }
    );
  }

  ngOnDestroy() {
    this.checkLoadingService.set(false);
  }

  clearSearchBox() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.employeeList.filter = this.searchKey.trim().toLowerCase();
  }

  openCreateEmployeeDialog() {
    this.employeeDialog.openEmployeeInfoDialog();
  }

  openEditEmployeeDialog(data) {
    this.employeeService.form.setValue(_.omit(data, 'departmentName'));
    this.employeeDialog.openEmployeeInfoDialog();
  }
}
