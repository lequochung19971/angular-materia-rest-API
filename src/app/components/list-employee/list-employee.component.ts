import { Component, OnInit } from '@angular/core';
import { CheckLoadingService } from 'src/app/shared/check-loading.service';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.scss']
})
export class ListEmployeeComponent implements OnInit {
  constructor(private checkLoadingService: CheckLoadingService) {}

  ngOnInit() {}
}
