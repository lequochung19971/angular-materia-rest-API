import { Component, OnInit } from '@angular/core';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog.service';
import { EmployeeService } from 'src/app/shared/employee.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  constructor(
    private dialogService: ConfirmDialogService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {}

  onClickExit(beClick: boolean) {
    console.log(this.employeeService.form.dirty);
    if (beClick && this.employeeService.form.dirty) {
      this.openConfirm('Do you want discard changes?');
    } else {
      this.router.navigate(['/employeeTable']);
    }
  }

  openConfirm(mess: string) {
    this.dialogService.openConfirmDialog(mess);
  }
}
