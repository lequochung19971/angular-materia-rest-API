import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { CheckLoadingService } from 'src/app/check-loading.service';
import { DeparmentService } from 'src/app/shared/deparment.service';
import { Employee } from 'src/app/model/employee.model';

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
    'dapartment',
    'mobile',
    'city',
    'actions'
  ];

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) pagi: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private checkLoadingService: CheckLoadingService,
    private depService: DeparmentService
  ) {
    checkLoadingService.set(true);
  }

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(
      data => {
        let array = data.map(item => {
          let deparmentName = this.depService.getDepartmentName(
            item.payload.val()['dapartment']
          );
          return {
            $key: item.key,
            department: deparmentName,
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
