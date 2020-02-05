import { Component, OnInit, DoCheck } from '@angular/core';
import { EmployeeService } from 'src/app/service/employee.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})
export class EmployeeTableComponent implements OnInit {
  employeeList: MatTableDataSource<any>;
  displayedColumns: string[] = ['fullName'];
  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(list => {
      let array = list.map(item => {
        return { $key: item.key, ...item.payload.val() };
      });
      this.employeeList = new MatTableDataSource(array);
    });
  }

  ngDoCheck() {
    console.log(this.employeeList);
  }
}
