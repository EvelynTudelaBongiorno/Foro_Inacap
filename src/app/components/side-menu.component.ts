import { Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit, OnDestroy {
  username: string = 'Usuario';
  private authSubscription: Subscription;
  private profileUpdatedEmitter = new EventEmitter<any>();

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private profileService: ProfileService
  ) {
    this.authSubscription = this.afAuth.authState.subscribe(user => {
      if (user) {
        this.username = user.displayName || 'Usuario';
      }
    });
    this.profileService.profileUpdated$.subscribe(user => {
      this.onProfileUpdated(user);
    });
  }

  ngOnInit() {
    this.profileUpdatedEmitter.subscribe(user => {
      this.onProfileUpdated(user);
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async logout() {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  onProfileUpdated(user: any) {
    this.username = user.displayName || 'Usuario';
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  updateProfile(user: any) {
    this.profileUpdatedEmitter.emit(user);
  }
}
