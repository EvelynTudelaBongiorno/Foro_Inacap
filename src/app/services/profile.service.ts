import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileUpdatedSource = new Subject<any>();
  profileUpdated$ = this.profileUpdatedSource.asObservable();

  updateProfile(user: any) {
    this.profileUpdatedSource.next(user);
  }
}

