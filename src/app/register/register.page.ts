/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  user = {
    email: '',
    password: '',
    confirmPassword: ''
  };
  passwordMismatch = false;
  registerForm: FormGroup;
  showPassword: boolean = false; // Para mostrar/ocultar la contraseña
  showConfirmPassword: boolean = false; // Para mostrar/ocultar la confirmación de contraseña

  constructor(private router: Router, private afAuth: AngularFireAuth, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  async register() {
    this.passwordMismatch = false;

    if (this.registerForm.invalid) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    const { email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);
      alert('Registro exitoso. Ahora puede iniciar sesión.');
      this.router.navigate(['/login']); // Cambiado de '/home' a '/login'
    } catch (error: any) {
      let errorMessage = 'Error al registrar el usuario';
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'El correo electrónico ya está en uso.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'El correo electrónico no es válido.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Operación no permitida.';
            break;
          case 'auth/weak-password':
            errorMessage = 'La contraseña es demasiado débil.';
            break;
        }
      }
      alert(errorMessage);
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
