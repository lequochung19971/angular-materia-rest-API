import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  DoCheck
} from '@angular/core';

@Component({
  selector: 'app-employee-searchbox',
  templateUrl: './employee-searchbox.component.html',
  styleUrls: ['./employee-searchbox.component.scss']
})
export class EmployeeSearchboxComponent implements OnInit {
  @Output() search = new EventEmitter();
  @Input() searchKey: string;
  constructor() {}

  ngOnInit() {}

  onSearch(value: string) {
    this.search.emit(this.searchKey);
  }

  clearSearchBox() {
    this.searchKey = '';
    this.search.emit(this.searchKey);
  }
}
