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
import { CalculatorService } from 'src/app/shared/calculator.service';
import { EmployeeRestService } from 'src/app/shared/employee-rest.service';
import { Employee } from 'src/app/model/employee.model';
import { CheckLoadingService } from 'src/app/shared/check-loading.service';
import { MatDialogRef } from '@angular/material';
import { EmployeeTableComponent } from '../employee-table/employee-table.component';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  @Output() isFilled = new EventEmitter();

  departments = ['Accountant', 'Software Engineer', 'Developer', 'Team Leader'];

  newEmployee: Employee;

  objTest = [1, 2, 3, 4, 5, 5];

  constructor(
    private employeeService: EmployeeService,
    private employeeServiceR: EmployeeRestService,
    private depService: DeparmentService,
    private notiService: NotificationService,
    private calculator: CalculatorService,
    private checkLoading: CheckLoadingService,
    private dialogRef: MatDialogRef<EmployeeTableComponent>
  ) {}

  ngOnInit() {
    this.employeeService.getEmployees();
  }

  onClear() {
    this.employeeServiceR.form.reset();
    this.employeeServiceR.initializeFormGroup();
    this.notiService.openSnackBar('Fields were cleared', 'error');
  }

  onSubmit() {
    if (this.employeeServiceR.form.valid) {
      this.checkLoading.isLoading$.next(true);
      if (!this.employeeServiceR.form.get('id').value) {
        this.employeeServiceR
          .createEmployee(this.employeeServiceR.form.value)
          .subscribe((newEmployee: Employee) => {
            this.dialogRef.close(true);
            this.checkLoading.isLoading$.next(false);
            this.notiService.openSnackBar('Submitted Successfully', 'success');
          }),
          error => {
            this.checkLoading.isLoading$.next(false);
            this.notiService.openSnackBar('Submitted Unsuccessfully', 'error');
          };
      }
      // else {
      //   this.employeeService.updateEmployee(this.employeeService.form.value);
      //   this.notiService.openSnackBar('Editted Successfully', 'success');
      // }
      this.employeeServiceR.form.reset();
      this.employeeServiceR.initializeFormGroup();
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
  ngOnDestroy(): void {
    this.checkLoading.isLoading$.next(false);
    this.checkLoading.isLoading$.complete();
  }
}
