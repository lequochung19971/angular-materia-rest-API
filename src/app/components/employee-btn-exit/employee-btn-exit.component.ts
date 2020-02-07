import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-employee-btn-exit',
  templateUrl: './employee-btn-exit.component.html',
  styleUrls: ['./employee-btn-exit.component.scss']
})
export class EmployeeBtnExitComponent implements OnInit {
  @Output() beClick = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  exit() {
    this.beClick.emit(true);
  }

}
