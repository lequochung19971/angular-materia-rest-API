import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/service/employee.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { CheckLoadingService } from 'src/app/check-loading.service';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})
export class EmployeeTableComponent implements OnInit, OnDestroy {
  employeeList: MatTableDataSource<any>;
  searchKey: string = '';

  displayedColumns: string[] = [
    'fullName',
    'email',
    'mobile',
    'city',
    'actions'
  ];

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) pagi: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private checkLoadingService: CheckLoadingService
  ) {
    checkLoadingService.set(true);
  }

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(
      data => {
        let array = data.map(item => {
          return { $key: item.key, ...item.payload.val() };
        });
        this.employeeList = new MatTableDataSource(array);
        this.checkLoadingService.set(false);
        this.employeeList.sort = this.sort;
        this.employeeList.paginator = this.pagi;
      },
      () => {
        this.checkLoadingService.set(false);
      }
    );
  }

  ngOnDestroy() {
    this.checkLoadingService.set(true);
  }

  clearSearchBox() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.employeeList.filter = this.searchKey.trim().toLowerCase();
  }
}
