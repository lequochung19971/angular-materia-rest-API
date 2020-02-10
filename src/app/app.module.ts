import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListEmployeeComponent } from './components/list-employee/list-employee.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { ComfirmDialogComponent } from './components/comfirm-dialog/comfirm-dialog.component';
import { EmployeeDeleteComponent } from './components/employee-delete/employee-delete.component';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
@NgModule({
  declarations: [
    AppComponent,
    ListEmployeeComponent,
    EmployeeTableComponent,
    EmployeeFormComponent,
    ComfirmDialogComponent,
    EmployeeDeleteComponent,
    EmployeeEditComponent,
    SnackbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ComfirmDialogComponent,
    EmployeeFormComponent,
    SnackbarComponent
  ]
})
export class AppModule {}
