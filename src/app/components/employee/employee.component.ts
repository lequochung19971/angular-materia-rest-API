import { Component, OnInit, DoCheck } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { DeparmentService } from 'src/app/shared/deparment.service';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/shared/notification.service';
import { Employee } from 'src/app/model/employee.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  constructor(
    private employeeService: EmployeeService,
    private depService: DeparmentService,
    private notiService: NotificationService
  ) {}

  ngOnInit() {
    this.employeeService.getEmployees();
  }

  onClear() {
    this.employeeService.form.reset();
    this.employeeService.initializeFormGroup();
    this.employeeService.getEmployees();
    this.notiService.successMessage(
      'XXX Fields were cleared',
      'snackbar-clear'
    );
  }

  onSubmit() {
    if (this.employeeService.form.valid) {
      this.employeeService.insertEmployee(this.employeeService.form.value);
      this.employeeService.form.reset();
      this.employeeService.initializeFormGroup();
      this.notiService.successMessage(
        '::: Submitted Successfully',
        'snackbar-success'
      );
    }
  }
}
