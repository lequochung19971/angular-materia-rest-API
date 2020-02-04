import { Component, OnInit, DoCheck } from '@angular/core';
import { EmployeeService } from 'src/app/service/employee.service';
import { DeparmentService } from 'src/app/services/deparment.service';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';

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
    this.depService.getDepartments();
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
