import { Component, OnInit } from '@angular/core';
import { CheckLoadingService } from 'src/app/shared/check-loading.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class ListEmployeeComponent implements OnInit {
  constructor(private checkLoadingService: CheckLoadingService) {}

  ngOnInit() {}
}
