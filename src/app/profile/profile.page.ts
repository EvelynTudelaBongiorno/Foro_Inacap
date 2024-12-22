import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseError } from '@angular/fire/app';
import { NavController } from '@ionic/angular';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user: any;
  editMode: boolean = false;
  profileForm: FormGroup;
  showPassword: boolean = false; // Para mostrar/ocultar la nueva contraseña
  showConfirmPassword: boolean = false; // Para mostrar/ocultar la confirmación de contraseña
  @Output() profileUpdated = new EventEmitter<any>();

  constructor(private afAuth: AngularFireAuth, private router: Router, private fb: FormBuilder, private navCtrl: NavController, private profileService: ProfileService) {
    this.loadUserProfile();
    this.profileForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    });
  }

  async loadUserProfile() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.user = {
        email: user.email,
        displayName: user.displayName || 'Usuario sin nombre',
        photoURL: user.photoURL || 'assets/default-avatar.png'
      };
      this.profileForm.patchValue({
        displayName: this.user.displayName,
        email: this.user.email
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async updateProfile() {
    if (this.profileForm.valid) {
      const { displayName, email, password, confirmPassword } = this.profileForm.value;

      if (password && password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      try {
        const user = await this.afAuth.currentUser;
        if (user) {
          await user.updateProfile({ displayName });
          if (email !== user.email) {
            await user.updateEmail(email);
          }
          if (password) {
            await user.updatePassword(password);
          }
          this.profileService.updateProfile({ displayName: displayName });
          alert('Perfil actualizado con éxito');
          this.editMode = false;
          this.loadUserProfile(); // Recargar el perfil
        }
      } catch (error: unknown) {
        let errorMessage = 'Error al actualizar el perfil';
        if (error instanceof FirebaseError) {
          errorMessage = error.message;
        }
        alert(errorMessage);
      }
    }
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}
