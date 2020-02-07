import {
  Component,
  OnInit,
  DoCheck,
  Output,
  EventEmitter
} from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { DeparmentService } from 'src/app/shared/deparment.service';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/shared/notification.service';
import { Employee } from 'src/app/model/employee.model';
import { CalculatorService } from 'src/app/shared/calculator.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  @Output() isFilled = new EventEmitter();
  constructor(
    private employeeService: EmployeeService,
    private depService: DeparmentService,
    private notiService: NotificationService,
    private calculator: CalculatorService
  ) {}

  ngOnInit() {
    this.employeeService.getEmployees();
  }

  onClear() {
    this.employeeService.form.reset();
    this.employeeService.initializeFormGroup();
    this.employeeService.getEmployees();
    this.notiService.openSnackBar('Fields were cleared', 'error');
  }

  onSubmit() {
    if (this.employeeService.form.valid) {
      if (!this.employeeService.form.get('$key').value) {
        this.employeeService.insertEmployee(this.employeeService.form.value);

        this.notiService.openSnackBar('Submitted Successfully', 'success');
      } else {
        this.employeeService.updateEmployee(this.employeeService.form.value);
      }
      this.employeeService.form.reset();
      this.employeeService.initializeFormGroup();
    }
  }

  formatFullName() {
    let strBeConvert = this.calculator.uppercaseFirstOfEachLetter(
      this.employeeService.form.get('fullName').value
    );
    this.employeeService.form.get('fullName').setValue(strBeConvert);
  }

  getErrorMessage(field) {
    if (field === 'fullName') {
      return this.employeeService.form.controls[field].hasError('required')
        ? 'This field is mandatory.'
        : this.employeeService.form.controls[field].hasError('pattern')
        ? 'Only contains letters.'
        : '';
    }
    if (field === 'email') {
      return this.employeeService.form.controls[field].hasError('email')
        ? 'Invalid email address.'
        : this.employeeService.form.controls[field].hasError('required')
        ? 'This field is mandatory.'
        : '';
    }
    if (field === 'mobile') {
      return this.employeeService.form.controls[field].hasError('minlength')
        ? 'Minimum 9 charactors needed.'
        : this.employeeService.form.controls[field].hasError('required')
        ? 'This field is mandatory.'
        : this.employeeService.form.controls[field].hasError('maxlength')
        ? 'Maximum 20 charactors needed.'
        : this.employeeService.form.controls[field].hasError('pattern')
        ? 'Only contains numbers.'
        : '';
    }
  }
}
