import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeComponent } from './components/employee/employee.component';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';

const routes: Routes = [
  { path: 'addEmployee', component: EmployeeComponent },
  { path: 'employeeTable', component: EmployeeTableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
