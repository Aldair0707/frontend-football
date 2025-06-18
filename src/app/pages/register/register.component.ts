import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'TODOS LOS CAMPOS SON OBLIGATORIOS';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'LAS CONTRASEÑAS NO COINCIDEN';
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.successMessage = 'REGISTRO EXITOSO AHORA PUEDE INICIAR SESION';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'ERROR AL REGISTRAR USUARIO';
        console.error(err);
      }
    });
  }

   togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

      logout() {
  this.router.navigate(['']);
}
}
