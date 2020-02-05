import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckLoadingService {
  private isLoading: boolean = false;
  constructor() {}

  set(status: boolean) {
    this.isLoading = status;
  }

  get() {
    return this.isLoading;
  }
}
