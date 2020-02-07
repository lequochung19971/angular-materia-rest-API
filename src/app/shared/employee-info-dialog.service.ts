import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EmployeeFormComponent } from '../components/employee-form/employee-form.component';

@Injectable({
  providedIn: 'root'
})
export class EmployeeInfoDialogService {
  constructor(private dialog: MatDialog) {}

  openEmployeeInfoDialog() {
    return this.dialog.open(EmployeeFormComponent, {
      width: '1000px',
      position: { top: '150px' },
      disableClose: true,
      autoFocus: true
    });
  }
}
