import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DeparmentService {
  private departmentList: AngularFireList<any>;

  departments = [];

  constructor(private firebase: AngularFireDatabase) {
    this.departmentList = firebase.list('deparments');
    this.departmentList.snapshotChanges().subscribe(list => {
      this.departments = list.map(item => {
        return {
          $key: item.key,
          ...item.payload.val()
        };
      });
    });
  }

  getDepartmentName($key) {
    if ($key === '0') {
      return '';
    } else {
      return _.find(this.departments, obj => {
        return obj.$key === $key;
      })['name'];
    }
  }
}
