import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ComfirmDialogComponent } from '../components/comfirm-dialog/comfirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmDialog(mess: string) {
    return this.dialog.open(ComfirmDialogComponent, {
      width: '390px',
      position: { top: '75px' },
      disableClose: true,
      data: {
        message: mess
      }
    });
  }
}
