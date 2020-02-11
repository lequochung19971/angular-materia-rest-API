import {
  Component,
  OnInit,
  DoCheck,
  Output,
  EventEmitter
} from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { CalculatorService } from 'src/app/shared/calculator.service';
import { EmployeeRestService } from 'src/app/shared/employee-rest.service';
import { Employee } from 'src/app/model/employee.model';
import { CheckLoadingService } from 'src/app/shared/check-loading.service';
import { MatDialogRef, DateAdapter } from '@angular/material';
import { EmployeeTableComponent } from '../employee-table/employee-table.component';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  @Output() isFilled = new EventEmitter();

  departments = ['Accountant', 'Software Engineer', 'Developer', 'Team Leader'];

  newEmployee: Employee;

  constructor(
    private employeeServiceR: EmployeeRestService,
    private notiService: NotificationService,
    private calculator: CalculatorService,
    private checkLoading: CheckLoadingService,
    private dialogRef: MatDialogRef<EmployeeTableComponent>,
    private _adapter: DateAdapter<any>
  ) {
    this._adapter.setLocale('us');
  }

  ngOnInit() {}

  onClear() {
    this.employeeServiceR.resetFormGroup();
    this.notiService.openSnackBar('Fields were cleared', 'error');
  }

  onSubmit() {
    if (this.employeeServiceR.form.valid) {
      this.checkLoading.isLoading$.next(true);
      if (!this.employeeServiceR.form.get('id').value) {
        this.employeeServiceR
          .createEmployee(this.employeeServiceR.form.value)
          .subscribe(() => {
            this.dialogRef.close(true);
            this.checkLoading.isLoading$.next(false);
            this.notiService.openSnackBar('Created Successfully', 'success');
          }),
          error => {
            this.checkLoading.isLoading$.next(false);
            this.notiService.openSnackBar('Submitted Unsuccessfully', 'error');
          };
      } else {
        console.log('edit');
        this.employeeServiceR
          .updateEmployee(this.employeeServiceR.form.value)
          .subscribe(() => {
            this.dialogRef.close(true);
            this.checkLoading.isLoading$.next(false);
            this.notiService.openSnackBar('Updated Successfully', 'success');
          }),
          error => {
            this.checkLoading.isLoading$.next(false);
            this.notiService.openSnackBar('Updated Unsuccessfully', 'error');
          };
      }
    }
  }

  formatFullName() {
    let strBeConvert = this.calculator.uppercaseFirstOfEachLetter(
      this.employeeServiceR.form.get('fullName').value
    );
    this.employeeServiceR.form.get('fullName').setValue(strBeConvert);
  }

  getErrorMessage(field: string) {
    if (field === 'fullName') {
      return this.employeeServiceR.form.controls[field].hasError('required')
        ? 'This field is mandatory.'
        : this.employeeServiceR.form.controls[field].hasError('pattern')
        ? 'Only contains letters.'
        : '';
    }
    if (field === 'email') {
      return this.employeeServiceR.form.controls[field].hasError('email')
        ? 'Invalid email address.'
        : this.employeeServiceR.form.controls[field].hasError('required')
        ? 'This field is mandatory.'
        : '';
    }
    if (field === 'mobile') {
      return this.employeeServiceR.form.controls[field].hasError('minlength')
        ? 'Minimum 9 charactors needed.'
        : this.employeeServiceR.form.controls[field].hasError('required')
        ? 'This field is mandatory.'
        : this.employeeServiceR.form.controls[field].hasError('maxlength')
        ? 'Maximum 20 charactors needed.'
        : this.employeeServiceR.form.controls[field].hasError('pattern')
        ? 'Only contains numbers.'
        : '';
    }
    if (field === 'department') {
      return this.employeeServiceR.form.controls[field].hasError('required')
        ? 'This field is mandatory.'
        : '';
    }
    if (field === 'password') {
      return this.employeeServiceR.form.controls[field].hasError('minlength')
        ? 'Minimum 8 charactors needed.'
        : this.employeeServiceR.form.controls[field].hasError('required')
        ? 'This field is mandatory.'
        : this.employeeServiceR.form.controls[field].hasError('maxlength')
        ? 'Maximum 30 charactors needed.'
        : '';
    }
    if (field === 'confirmPassword') {
      return this.employeeServiceR.form.controls[field].hasError('minlength')
        ? 'Minimum 8 charactors needed.'
        : this.employeeServiceR.form.controls[field].hasError('required')
        ? 'This field is mandatory.'
        : this.employeeServiceR.form.controls[field].hasError('maxlength')
        ? 'Maximum 30 charactors needed.'
        : this.employeeServiceR.form.controls[field].hasError(
            'passwordNotMatch'
          )
        ? 'Passwords do not match.'
        : '';
    }
  }

  ngOnDestroy(): void {
    this.checkLoading.isLoading$.next(false);
    this.checkLoading.isLoading$.complete();
  }
}
