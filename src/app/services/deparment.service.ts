import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class DeparmentService {
  private departmentList: AngularFireList<any>;

  departments = [];

  constructor(private firebase: AngularFireDatabase) {}

  getDepartments() {
    this.departmentList = this.firebase.list('deparments');
    this.departmentList.snapshotChanges().subscribe(list => {
      this.departments = list.map(item => {
        return {
          $key: item.key,
          ...item.payload.val()
        };
      });
    });
  }
}
