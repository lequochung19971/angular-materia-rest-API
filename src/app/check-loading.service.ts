import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckLoadingService {
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() {}
}
